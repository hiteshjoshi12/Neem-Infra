import React from 'react';
import JsonLd from './JsonLd';
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo/schemaBuilders';
import { getGlobalSeoSettings } from '@/lib/seo/dynamicSeo';
import { getBusinessProfile } from '@/lib/dal';

/**
 * OrganizationJsonLd — Renders Organization + LocalBusiness + WebSite Connected Graph
 * ====================================================================================
 * Connects WebSite (#website) and Organization/RealEstateAgent (#organization)
 * into a single unified Schema.org graph for authoritative business entity discovery.
 * Driven directly by Admin Panel CMS settings & business profile with verified fallbacks.
 */
export default async function OrganizationJsonLd({ settings = null, profile = null }) {
  let liveSettings = settings;
  let liveProfile = profile;

  if (!liveSettings || !liveProfile) {
    try {
      const [dbSettings, dbProfile] = await Promise.all([
        liveSettings ? Promise.resolve(liveSettings) : getGlobalSeoSettings(),
        liveProfile ? Promise.resolve(liveProfile) : getBusinessProfile().catch(() => null),
      ]);
      liveSettings = dbSettings;
      liveProfile = dbProfile;
    } catch {}
  }

  const organization = buildOrganizationSchema(liveSettings, liveProfile);
  const website = buildWebSiteSchema(liveSettings, liveProfile);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [website, organization].filter(Boolean),
  };

  return <JsonLd data={graph} />;
}

