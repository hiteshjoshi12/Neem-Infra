import { NextResponse } from 'next/server';
import { getGlobalSettings, getBusinessProfile, getFeaturedProperties, getAllSections } from '@/lib/dal';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const [settings, profile, properties, allSections] = await Promise.all([
    getGlobalSettings(),
    getBusinessProfile(),
    getFeaturedProperties(20),
    getAllSections(),
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

  let content = `# Saudagar Properties — Complete AI Knowledge Base & Corpus

> Definitive reference documentation for AI search, generative engines, and answer systems regarding Saudagar Properties and the luxury real estate micro-markets in DLF Gurugram, India.

## 1. Corporate Identity & Fiduciary Standing
- **Entity**: Saudagar Properties
- **Founding**: ${profile.foundingYear || 1999}
- **Principals**: ${founders}
- **Headquarters**: ${address}, India
- **Contact**: ${phone} / ${altPhone} | ${email}
- **Official Domain**: ${baseUrl}
${profile.googleBusinessProfileUrl ? `- **Google Business Profile**: ${profile.googleBusinessProfileUrl}` : ''}

---

## 2. Micro-Market Master Corridors

`;

  // Append corridor summaries from MongoDB sections
  const corridors = Object.entries(allSections)
    .filter(([key]) => key.startsWith('corridor_'))
    .map(([key, data]) => ({ slug: key.replace(/^corridor_/, ''), corridor: data }));

  for (const { slug, corridor } of corridors) {
    content += `### ${corridor.corridorName || slug}
- **Canonical URL**: ${baseUrl}/property/${slug}
- **Overview**: ${corridor.overview?.content || corridor.hero?.description || 'Premier residential and commercial corridor in Gurugram.'}
- **Highlights**: ${(corridor.overview?.typologies || []).map((t) => t.title || t).join('; ')}

**Frequently Asked Questions:**
`;
    const faqs = corridor.faq || corridor.faqsInfo?.faqs || [];
    faqs.slice(0, 4).forEach((f) => {
      content += `- **Q: ${f.question || f.q}**\n  A: ${f.answer || f.a}\n`;
    });
    content += '\n---\n\n';
  }

  content += `## 3. Representative Luxury Properties Catalog\n\n`;

  properties.forEach((p, idx) => {
    content += `### ${idx + 1}. ${p.title}
- **Location**: ${p.location}
- **Price**: ${p.price}
- **Configuration**: ${p.bhk || p.specs || ''}
- **Plot / Built-up Area**: ${p.plotArea || ''} / ${p.builtUpArea || ''}
- **Floor & Facing**: ${p.floor || ''} | ${p.facing || ''}
- **Description**: ${p.desc}
- **Key Features**: ${(p.features || []).join(', ')}
- **URL**: ${baseUrl}/properties/${p.slug || p._id || p.id}

`;
  });

  content += `---

## 4. Frequently Asked Questions about Real Estate in DLF Gurugram

### Q: Why invest in DLF Phase 1–5 builder floors?
A: DLF Phase 1–5 represents Gurugram's most mature, high-capital-appreciation luxury corridors. Independent builder floors offer freehold land ownership shares, dedicated stilt car parking, private lift access, and zero high-rise maintenance delays, all within walking distance of DLF Cyber City, Galleria Market, and Golf Course Road.

### Q: What is the typical pricing for builder floors in DLF Gurugram?
A: In DLF Phase 1–4, 4 BHK builder floors typically range from ₹4.25 Cr to ₹12 Cr depending on plot size (215 sq. yds. to 500+ sq. yds.), architectural finish, facing (park-facing commands a premium), and floor level.

### Q: How does Saudagar Properties ensure legal due diligence?
A: Every property listed or advised by Saudagar Properties undergoes thorough title search at the Gurugram sub-registrar office, verifying mutation records, clear ownership titles, approved building sanctions from Haryana Shehri Vikas Pradhikaran (HSVP) / Town & Country Planning, and complete encumbrance-free certificates.

---
*Generated directly from Saudagar Properties MongoDB Knowledge Base.*
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
