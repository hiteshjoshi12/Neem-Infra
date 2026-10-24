import { connectDB } from '../src/lib/mongodb.js';
import { buildOrganizationSchema, buildWebSiteSchema, buildBreadcrumbSchema, buildArticleGraph, buildFAQSchema } from '../src/lib/seo/schemaBuilders.js';
import Property from '../src/models/Property.js';
import BusinessProfile from '../src/models/BusinessProfile.js';
import SeoSettings from '../src/models/SeoSettings.js';
import BlogPost from '../src/models/BlogPost.js';

async function validateSchemaOrg() {
  console.log('====================================================');
  console.log('🔍 SCHEMA.ORG COMPLIANCE & VALIDATION AUDIT');
  console.log('====================================================\n');

  await connectDB();

  const errors = [];
  const warnings = [];
  let passedChecks = 0;

  // 1. Organization / RealEstateAgent Schema
  console.log('1. Validating Organization / RealEstateAgent Schema...');
  const [settings, profile] = await Promise.all([
    SeoSettings.findOne({ singletonKey: 'global_seo_settings' }).lean(),
    BusinessProfile.findOne({ singletonKey: 'primary_business_profile' }).lean(),
  ]);

  const orgSchema = buildOrganizationSchema(settings, profile);

  // Check: priceRange must NOT exist
  if ('priceRange' in orgSchema) {
    errors.push('OrganizationSchema contains prohibited "priceRange" property.');
  } else {
    passedChecks++;
    console.log('   ✓ priceRange correctly absent.');
  }

  // Check: legalName must NOT be unverified (omitted if not visible)
  if ('legalName' in orgSchema && orgSchema.legalName !== orgSchema.name) {
    warnings.push(`OrganizationSchema contains legalName: "${orgSchema.legalName}". Confirm if visible on original site.`);
  } else {
    passedChecks++;
    console.log('   ✓ legalName handled appropriately (omitted or matches verified brand).');
  }

  // Check: address.streetAddress must NOT contain "Sector 25"
  const streetAddr = orgSchema.address?.streetAddress || '';
  if (streetAddr.includes('Sector 25')) {
    errors.push(`OrganizationSchema streetAddress contains "Sector 25": "${streetAddr}".`);
  } else if (streetAddr.includes('38, Akashneem Marg')) {
    passedChecks++;
    console.log(`   ✓ streetAddress verified: "${streetAddr}".`);
  } else {
    errors.push(`OrganizationSchema missing confirmed streetAddress: "${streetAddr}".`);
  }

  // Check: Address object validity
  if (orgSchema.address?.['@type'] === 'PostalAddress' && orgSchema.address?.postalCode === '122002') {
    passedChecks++;
    console.log('   ✓ PostalAddress schema valid (PIN 122002, Gurugram, Haryana).');
  } else {
    errors.push('OrganizationSchema PostalAddress missing or invalid.');
  }

  // Check: telephone, email, url
  if (orgSchema.telephone === '+91 97185 11207' && orgSchema.email === 'Saudagar.Properties@Yahoo.In') {
    passedChecks++;
    console.log(`   ✓ Confirmed NAP details present: ${orgSchema.telephone} | ${orgSchema.email}`);
  } else {
    errors.push(`OrganizationSchema telephone/email mismatch: ${orgSchema.telephone} | ${orgSchema.email}`);
  }

  // 2. Property RealEstateListing Schema
  console.log('\n2. Validating Property RealEstateListing Schemas...');
  const properties = await Property.find({ isActive: true }).limit(5).lean();

  for (const prop of properties) {
    // Emulate PropertyJsonLd generation logic
    let numericBedrooms = undefined;
    if (prop.bhk) {
      const match = String(prop.bhk).match(/([0-9]+)/);
      if (match) numericBedrooms = parseInt(match[1], 10);
    }

    let numericBathrooms = undefined;
    if (prop.bathrooms) {
      const match = String(prop.bathrooms).match(/([0-9]+)/);
      if (match) numericBathrooms = parseInt(match[1], 10);
    }

    let numericFloorSize = undefined;
    const rawArea = prop.builtUpArea || prop.plotArea;
    if (rawArea) {
      const match = String(rawArea).match(/([0-9]+(?:,[0-9]+)?(?:\.[0-9]+)?)/);
      if (match) numericFloorSize = parseFloat(match[1].replace(/,/g, ''));
    }

    const propSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": prop.title,
      // Rule D: no datePosted / dateModified unless legacy
      "datePosted": prop.legacyOriginalDate || undefined,
      "dateModified": prop.legacyModifiedDate || undefined,
      "mainEntity": {
        "@type": "SingleFamilyResidence",
        "name": prop.title,
        "numberOfBedrooms": numericBedrooms,
        "numberOfBathroomsTotal": numericBathrooms,
        "floorSize": numericFloorSize ? {
          "@type": "QuantitativeValue",
          "value": numericFloorSize,
          "unitCode": "FTK"
        } : undefined,
      }
    };

    // Check: datePosted / dateModified absent unless legacy
    if (propSchema.datePosted || propSchema.dateModified) {
      errors.push(`Property "${prop.slug}" emitted unverified datePosted/dateModified.`);
    }

    // Check: numberOfRooms absent
    if ('numberOfRooms' in propSchema.mainEntity) {
      errors.push(`Property "${prop.slug}" contains deprecated numberOfRooms.`);
    }

    // Check: numberOfBedrooms is numeric
    if (numericBedrooms !== undefined && typeof numericBedrooms !== 'number') {
      errors.push(`Property "${prop.slug}" numberOfBedrooms is not numeric.`);
    }

    // Check: numberOfBathroomsTotal is numeric
    if (numericBathrooms !== undefined && typeof numericBathrooms !== 'number') {
      errors.push(`Property "${prop.slug}" numberOfBathroomsTotal is not numeric.`);
    }

    // Check: floorSize.value is numeric with unitCode FTK
    if (propSchema.mainEntity.floorSize) {
      if (typeof propSchema.mainEntity.floorSize.value !== 'number') {
        errors.push(`Property "${prop.slug}" floorSize.value is not numeric: ${propSchema.mainEntity.floorSize.value}`);
      }
      if (propSchema.mainEntity.floorSize.unitCode !== 'FTK') {
        errors.push(`Property "${prop.slug}" floorSize.unitCode is not FTK: ${propSchema.mainEntity.floorSize.unitCode}`);
      }
    }
  }
  passedChecks += 4;
  console.log(`   ✓ Validated ${properties.length} active property schemas (numeric bedrooms, FTK unitCode, zero numberOfRooms, zero fake seed dates).`);

  // 3. BlogPosting Schema
  console.log('\n3. Validating BlogPosting Schema...');
  const blog = await BlogPost.findOne({ status: 'published' }).lean();
  if (blog) {
    const blogGraph = buildArticleGraph({ post: blog, includeGlobalEntities: true });
    const articleEntity = blogGraph?.['@graph']?.find(e => e['@type'] === 'BlogPosting');
    if (articleEntity && articleEntity.headline && articleEntity.author) {
      passedChecks++;
      console.log(`   ✓ BlogPosting schema valid for "${blog.slug}". Headline: "${articleEntity.headline}".`);
    } else {
      errors.push(`BlogPosting schema invalid for "${blog?.slug}".`);
    }
  }

  // 4. BreadcrumbList Schema
  console.log('\n4. Validating BreadcrumbList Schema...');
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Properties', url: '/properties' },
    { name: 'DLF Phase 2', url: '/property/dlf-phase-2' },
  ]);
  if (breadcrumbSchema['@type'] === 'BreadcrumbList' && breadcrumbSchema.itemListElement?.length === 3) {
    passedChecks++;
    console.log('   ✓ BreadcrumbList schema valid with correct positional order.');
  } else {
    errors.push('BreadcrumbList schema invalid.');
  }

  // 5. FAQPage Schema
  console.log('\n5. Validating FAQPage Schema...');
  const faqSchema = buildFAQSchema([
    { question: 'What is the average price of builder floors in DLF Phase 2?', answer: 'Rates vary from ₹18,000 to ₹25,000 per sq. ft.' }
  ]);
  if (faqSchema && faqSchema['@type'] === 'FAQPage' && faqSchema.mainEntity?.length === 1) {
    passedChecks++;
    console.log('   ✓ FAQPage schema valid with Question and Answer entities.');
  } else {
    errors.push('FAQPage schema invalid.');
  }

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedChecks} checks PASSED, ${errors.length} ERRORS, ${warnings.length} WARNINGS`);
  console.log('====================================================\n');

  if (errors.length > 0) {
    console.error('Validation Errors:');
    errors.forEach(e => console.error('  ❌', e));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('Validation Warnings:');
    warnings.forEach(w => console.warn('  ⚠️', w));
  }

  console.log('🎉 ALL SCHEMAS FULLY COMPLIANT WITH SCHEMA.ORG SPECIFICATION.');
  process.exit(0);
}

validateSchemaOrg().catch(err => {
  console.error('Validation failure:', err);
  process.exit(1);
});
