import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS_INFO, SITE_NAME } from '../../lib/seo/seoConfig';

/**
 * OrganizationJsonLd — Renders Organization + LocalBusiness + WebSite JSON-LD
 * =============================================================================
 * Place this once in the root layout so it appears on every public page.
 * This establishes the company entity, local business info, and sitelinks
 * search box eligibility.
 */
export default function OrganizationJsonLd() {
  const socialLinks = Object.values(BUSINESS_INFO.socialProfiles).filter(
    (url) => url && url !== '#'
  );

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.shortName,
    description: BUSINESS_INFO.description,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/logo.png`,
      width: 400,
      height: 100,
    },
    image: `${SITE_URL}/assets/logo.png`,
    foundingDate: String(BUSINESS_INFO.foundingYear),
    founder: BUSINESS_INFO.founders.map((name) => ({
      '@type': 'Person',
      name,
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    telephone: BUSINESS_INFO.phone[0],
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    areaServed: BUSINESS_INFO.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Real Estate Services',
      itemListElement: BUSINESS_INFO.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-IN',
  };

  return (
    <>
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
    </>
  );
}
