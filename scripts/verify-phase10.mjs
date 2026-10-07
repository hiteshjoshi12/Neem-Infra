import { runFullContentSeoAudit } from '../src/lib/seo/seoAuditor.js';
import { getSearchConsolePerformance, getSearchConsoleStatus } from '../src/services/searchConsoleService.js';
import * as analytics from '../src/lib/analytics/analytics.js';

async function runPhase10Verification() {
  console.log('\n=============================================================');
  console.log('📈 SAUDAGAR PROPERTIES — PHASE 10 SEARCH PERFORMANCE AUDIT');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // Test Suite 1: Analytics Architecture & 10 Required Event Handlers
  // ---------------------------------------------------------------------------
  console.log('Test Suite 1: Analytics Architecture (10 Required Event Handlers)');
  const requiredEvents = [
    'trackArticlePageView',
    'trackScrollDepth',
    'trackCtaClick',
    'trackPhoneClick',
    'trackContactFormSubmission',
    'trackPropertyInquiryClick',
    'trackRelatedArticleClick',
    'trackCategoryClick',
    'trackLocationPageClick',
    'trackAuthorPageClick'
  ];

  requiredEvents.forEach(evt => {
    assert(typeof analytics[evt] === 'function', `Analytics event handler '${evt}' is implemented and exported`);
  });

  // Test general trackEvent dispatcher
  assert(typeof analytics.trackEvent === 'function', 'Universal trackEvent dispatcher is implemented');

  // ---------------------------------------------------------------------------
  // Test Suite 2: Reusable Technical SEO Audit Function
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 2: Reusable Content Technical SEO Audit Engine');
  const auditReport = await runFullContentSeoAudit();

  assert(auditReport && typeof auditReport === 'object', 'runFullContentSeoAudit() returns valid audit object');
  assert(typeof auditReport.summary === 'object', 'Audit report contains summary block');
  
  const s = auditReport.summary;
  assert(s.publishedArticles >= 6, `Published articles audited: ${s.publishedArticles}`);
  assert(s.indexedPages >= 40, `Estimated indexed pages in search surface: ${s.indexedPages}`);
  assert(s.orphanArticles === 0, `Zero orphan articles: ${s.orphanArticles}`);
  assert(s.deadEndArticles === 0, `Zero dead end articles: ${s.deadEndArticles}`);
  assert(s.missingMetadata === 0, `Zero missing metadata fields: ${s.missingMetadata}`);
  assert(s.duplicateTitles === 0, `Zero duplicate titles across published articles: ${s.duplicateTitles}`);
  assert(s.duplicateDescriptions === 0, `Zero duplicate meta descriptions: ${s.duplicateDescriptions}`);
  assert(s.missingAltText === 0, `Zero missing or spammy alt texts: ${s.missingAltText}`);
  assert(s.missingFeaturedImages === 0, `Zero missing featured images: ${s.missingFeaturedImages}`);
  assert(s.articlesWithoutInternalLinks === 0, `Zero articles without internal links: ${s.articlesWithoutInternalLinks}`);
  assert(s.canonicalProblems === 0, `Zero canonical URL problems: ${s.canonicalProblems}`);
  assert(s.healthScore === 100, `Overall Content SEO Health Score is 100%: ${s.healthScore}%`);

  // Verify per-article audit objects
  assert(Array.isArray(auditReport.articleAudits), 'articleAudits is an array');
  auditReport.articleAudits.forEach(art => {
    assert(art.healthStatus === 'OPTIMAL', `Article '${art.slug}' healthStatus is OPTIMAL (0 issues)`);
    assert(art.inboundLinks > 0, `Article '${art.slug}' has ${art.inboundLinks} inbound links`);
    assert(art.outboundLinks > 0, `Article '${art.slug}' has ${art.outboundLinks} outbound links`);
    assert(art.canonical.startsWith('/blog/'), `Article '${art.slug}' has clean self-canonical path`);
  });

  // ---------------------------------------------------------------------------
  // Test Suite 3: Search Console Performance & Top Entities
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 3: Search Console Performance & Metrics Provider');
  const gsc = await getSearchConsolePerformance();

  assert(gsc && typeof gsc === 'object', 'Search Console performance metrics retrieved');
  assert(typeof gsc.summary === 'object', 'Search Console summary is present');
  assert(gsc.summary.totalClicks > 0, `Total organic clicks: ${gsc.summary.totalClicks.toLocaleString()}`);
  assert(gsc.summary.totalImpressions > 0, `Total search impressions: ${gsc.summary.totalImpressions.toLocaleString()}`);
  assert(gsc.summary.averageCtr > 0, `Average organic CTR: ${gsc.summary.averageCtr}%`);
  assert(gsc.summary.averagePosition > 0, `Average search position: ${gsc.summary.averagePosition}`);

  assert(Array.isArray(gsc.topQueries) && gsc.topQueries.length >= 5, `Top queries returned: ${gsc.topQueries.length}`);
  gsc.topQueries.forEach(q => {
    assert(typeof q.query === 'string' && q.query.length > 0, `Query '${q.query}' has valid string`);
    assert(q.clicks > 0 && q.impressions > 0, `Query '${q.query}' has clicks (${q.clicks}) and impressions (${q.impressions})`);
    assert(typeof q.position === 'number', `Query '${q.query}' has average position (${q.position})`);
  });

  assert(Array.isArray(gsc.topPages) && gsc.topPages.length >= 5, `Top landing pages returned: ${gsc.topPages.length}`);
  gsc.topPages.forEach(p => {
    assert(p.page.startsWith('/'), `Page path '${p.page}' is normalized root-relative`);
    assert(p.clicks > 0 && p.impressions > 0, `Page '${p.page}' has clicks (${p.clicks}) and impressions (${p.impressions})`);
  });

  // ---------------------------------------------------------------------------
  // Test Suite 4: Security & Credentials Confidentiality (Zero Client Leaks)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 4: Server-Side Confidentiality (Zero Credential Leakage)');
  const status = getSearchConsoleStatus();
  assert(typeof status === 'object', 'Status object returned');
  assert(!status.privateKey, 'Private key is NEVER returned in status object');
  assert(!status.secret, 'Secrets are NEVER returned in status object');
  assert(status.status === 'CONFIGURED' || status.status === 'PENDING_CREDENTIALS', `Connection state is sanitized: ${status.status}`);

  console.log('\n=============================================================');
  console.log(`📊 PHASE 10 AUDIT SUMMARY:`);
  console.log(`✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase10Verification().catch(err => {
  console.error('Audit crashed with error:', err);
  process.exit(1);
});
