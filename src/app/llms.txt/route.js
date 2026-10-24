import { NextResponse } from 'next/server';
import { getGlobalSettings, getBusinessProfile } from '@/lib/dal';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const [settings, profile] = await Promise.all([
    getGlobalSettings(),
    getBusinessProfile(),
  ]);

  const baseUrl = settings?.canonicalBaseUrl || 'https://saudagarproperties.com';
  const phone = profile.primaryPhone || '+91 97185 11207';
  const altPhone = profile.secondaryPhone || '+91 98112 21207';
  const email = profile.primaryEmail || 'Saudagar.Properties@Yahoo.In';
  const address = profile.address?.streetAddress
    ? `${profile.address.streetAddress}, ${profile.address.addressLocality}, ${profile.address.addressRegion} ${profile.address.postalCode}`
    : '38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002';
  const founders = (profile.founders && profile.founders.length > 0
    ? profile.founders
    : [{ name: 'Arun Sharma' }, { name: 'Suneeta Chawla' }]
  ).map((f) => f.name).join(', ');

  const content = `# Saudagar Properties

> Premier luxury real estate advisory and consultancy in DLF Gurugram, India. Founded in ${profile.foundingYear || 1999} by ${founders}.

## Organization & Entity Profile
- **Legal Name**: ${profile.legalName || 'Saudagar Properties'}
- **Founded**: ${profile.foundingYear || 1999}
- **Headquarters**: ${address}, India
- **Advisory Principals**: ${founders}
- **Primary Phone**: ${phone} / ${altPhone}
- **Official Email**: ${email}
- **Website**: ${baseUrl}
${profile.googleBusinessProfileUrl ? `- **Google Business Profile**: ${profile.googleBusinessProfileUrl}` : ''}

## Core Micro-Market Specializations
1. **DLF Phase 1**: Builder floors, luxury kothis, and residential plots near Arjun Marg and Golf Course Road.
2. **DLF Phase 2**: Ultra-luxury builder floors, private villas, and proximity to DLF Cyber City and Rapid Metro.
3. **DLF Phase 3**: Residential floors, strategic plots, and immediate access to Cyber Hub and NH-48.
4. **DLF Phase 4**: Luxury builder floors near Galleria Market and Hamilton Court.
5. **DLF Phase 5 & Golf Course Road**: Premium penthouses, luxury high-rises, and prime corporate assets.
6. **Sushant Lok 1**: Verified residential villas, independent floors, and commercial assets.
7. **Udyog Vihar**: Grade-A commercial office leasing and industrial plots.

## Advisory Services
- **Luxury Residential Acquisition**: Vetted independent builder floors, luxury villas, and prime plots with 100% verified legal titles and registry assistance.
- **Commercial & Corporate Leasing**: Grade-A corporate office suites, retail flagships, and institutional lease negotiation in Cyber City and Golf Course Road.
- **Industrial Assets**: Warehouses, logistics hubs, and strategic land parcels across Gurugram.
- **NRI Investment Desk**: End-to-end fiduciary transaction management, legal vetting, repatriation compliance, and asset management for global NRIs.

## Key Canonical URLs
- Homepage: ${baseUrl}/
- Prime Properties Portfolio: ${baseUrl}/properties
- DLF Phase 1 Advisory: ${baseUrl}/property/dlf-phase-1
- DLF Phase 2 Advisory: ${baseUrl}/property/dlf-phase-2
- DLF Phase 3 Advisory: ${baseUrl}/property/dlf-phase-3
- DLF Phase 4 Advisory: ${baseUrl}/property/dlf-phase-4
- Sushant Lok Advisory: ${baseUrl}/property/shushant-lok
- Udyog Vihar Advisory: ${baseUrl}/property/udyog-vihar
- About Us: ${baseUrl}/about
- Leadership & Team: ${baseUrl}/team
- Real Estate Journal & Market Research: ${baseUrl}/blog
- Confidential Advisory Desk: ${baseUrl}/contact

## Extended Documentation
For comprehensive property inventories, detailed micro-market guides, and full FAQs, fetch ${baseUrl}/llms-full.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
