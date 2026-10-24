import mongoose from 'mongoose';

async function revertTestData() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  console.log('Database connected:', db.databaseName);

  // 1. Revert Homepage Title in pages collection
  const pageRes = await db.collection('pages').updateOne(
    { path: '/' },
    {
      $set: {
        title: 'Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram',
        metaDescription: 'Find your dream luxury builder floor, independent villa, penthouse, or commercial office in DLF Phase 1–5, Sushant Lok & Golf Course Road. 25+ years of trusted advisory in Gurugram.',
        canonicalUrl: 'https://saudagarproperties.com/',
        updatedAt: new Date()
      }
    }
  );
  console.log('Reverted page title:', pageRes);

  // 2. Revert canonical URLs across all pages to remove www.
  const pages = await db.collection('pages').find({}).toArray();
  for (const p of pages) {
    if (p.canonicalUrl && p.canonicalUrl.includes('www.saudagarproperties.com')) {
      const fixedCanonical = p.canonicalUrl.replace('https://www.saudagarproperties.com', 'https://saudagarproperties.com');
      await db.collection('pages').updateOne(
        { _id: p._id },
        { $set: { canonicalUrl: fixedCanonical } }
      );
      console.log(`Updated canonical for ${p.path}: ${p.canonicalUrl} -> ${fixedCanonical}`);
    }
  }

  // 3. Revert BusinessProfile phone and set email to original Saudagar.Properties@Yahoo.In
  const profileRes = await db.collection('businessprofiles').updateOne(
    {},
    {
      $set: {
        primaryPhone: '+91 97185 11207',
        secondaryPhone: '+91 98112 21207',
        email: 'Saudagar.Properties@Yahoo.In',
        dlfAuthorizedVerified: false, // Default to OFF as requested in Item 5
        updatedAt: new Date()
      }
    }
  );
  console.log('Reverted business profile:', profileRes);

  // 4. Revert SeoSettings robotsTxtCustomRules and mode
  const seoRes = await db.collection('seosettings').updateOne(
    {},
    {
      $set: {
        canonicalBaseUrl: 'https://saudagarproperties.com',
        robotsTxtMode: 'standard',
        robotsTxtCustomRules: '',
        'organizationSchema.email': 'Saudagar.Properties@Yahoo.In',
        'organizationSchema.url': 'https://saudagarproperties.com',
        updatedAt: new Date()
      }
    }
  );
  console.log('Reverted SeoSettings:', seoRes);

  // 5. In SectionContent, revert any test FAQ in home_faq
  const faqRes = await db.collection('sectioncontents').findOne({ sectionKey: 'home_faq' });
  if (faqRes && faqRes.content?.items) {
    let modified = false;
    const items = faqRes.content.items.map(item => {
      if (item.question && item.question.includes('Live Test 1777')) {
        modified = true;
        return {
          ...item,
          question: 'What makes DLF Gurugram the most preferred luxury real estate destination?',
          answer: 'DLF Phase 1–5, Golf Course Road, and Sushant Lok offer unmatched infrastructure, immediate proximity to Cyber City and Delhi, world-class amenities, and historic long-term capital appreciation.'
        };
      }
      return item;
    });
    if (modified) {
      await db.collection('sectioncontents').updateOne(
        { sectionKey: 'home_faq' },
        { $set: { 'content.items': items, updatedAt: new Date() } }
      );
      console.log('Reverted home_faq test items');
    }
  }

  await mongoose.disconnect();
  console.log('Database revert complete.');
}

revertTestData();
