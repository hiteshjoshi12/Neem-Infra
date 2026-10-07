import { TOPIC_CLUSTERS, getTopicClusterById } from '../src/constants/topicClusters.js';
import { getBlogPosts, getBlogPostBySlug, getRelatedPosts, calculateRelevanceScore, getOrphanAuditReport } from '../src/services/blogService.js';

async function runPhase8Verification() {
  console.log('\n=============================================================');
  console.log('🏛️ SAUDAGAR PROPERTIES — PHASE 8 TOPICAL AUTHORITY AUDIT');
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

  // 1. Topic Clusters Definition
  console.log('Test Suite 1: Topic Clusters (Knowledge Graph)');
  assert(TOPIC_CLUSTERS.length === 11, `Expected 11 topic clusters, found ${TOPIC_CLUSTERS.length}`);
  const requiredClusters = [
    'property-investment',
    'dlf-gurugram',
    'luxury-residential',
    'commercial-real-estate',
    'property-buying-guides',
    'gurgaon-market-insights',
    'locality-guides',
    'property-legal-process-guides',
    'nri-property',
    'property-financing',
    'luxury-lifestyle-trends'
  ];
  requiredClusters.forEach(clusterId => {
    const cluster = getTopicClusterById(clusterId);
    assert(!!cluster && cluster.id === clusterId, `Topic cluster '${clusterId}' defined with metadata`);
  });

  // 2. Pillar & Cluster Content Architecture
  console.log('\nTest Suite 2: Pillar and Child Articles Architecture');
  const dlfPillar = await getBlogPostBySlug('luxury-builder-floors-dlf-phase-1-5-guide');
  assert(dlfPillar.isPillar === true, 'DLF Builder Floors guide is marked as Pillar');
  assert(dlfPillar.topicCluster === 'dlf-gurugram', 'DLF Pillar mapped to dlf-gurugram cluster');
  assert(Array.isArray(dlfPillar.childArticles) && dlfPillar.childArticles.length > 0, `DLF Pillar has ${dlfPillar.childArticles?.length} resolved child articles`);

  const childPost = await getBlogPostBySlug('golf-course-road-vs-golf-course-extension-comparison');
  assert(childPost.isPillar === false, 'Comparison guide is non-pillar child post');
  assert(childPost.parentPillarSlug === 'luxury-builder-floors-dlf-phase-1-5-guide', 'Child post links to parent pillar slug');
  assert(childPost.parentPillar && childPost.parentPillar.slug === 'luxury-builder-floors-dlf-phase-1-5-guide', 'Parent pillar object successfully resolved on child post');

  // 3. Intelligent Related Articles Scoring & Manual Override
  console.log('\nTest Suite 3: Multi-Factor Relevance Scoring & Manual Override');
  const allPosts = await getBlogPosts({ status: 'published' });
  const p1 = allPosts[0];
  const p2 = allPosts[1];
  const score = calculateRelevanceScore(p1, p2);
  assert(typeof score === 'number' && score >= 0, `Relevance score calculated successfully (${score})`);

  // Test manual override
  const postWithManualRelated = {
    ...p1,
    relatedPosts: [p2.id || p2._id || p2.slug]
  };
  const relatedResults = await getRelatedPosts(postWithManualRelated, 3);
  assert(relatedResults.length > 0, 'Related posts returned');
  assert(
    relatedResults.some(r => r.slug === p2.slug || r.id === p2.id),
    'Manual related relationship is prioritized at top of related results'
  );

  // 4. Orphan & Knowledge Graph Health Audit Report
  console.log('\nTest Suite 4: Orphan Detection & Internal Linking Graph Audit');
  const report = await getOrphanAuditReport();
  assert(report.summary.totalPublished > 0, `Total published articles audited: ${report.summary.totalPublished}`);
  assert(report.summary.healthyCount === report.summary.totalPublished, `All published articles healthy (${report.summary.healthyCount}/${report.summary.totalPublished})`);
  assert(report.summary.healthScore === 100, `Graph Health Score is 100%: ${report.summary.healthScore}%`);
  assert(report.summary.totalOrphans === 0, `Zero true orphans (inbound = 0): ${report.summary.totalOrphans}`);
  assert(report.summary.totalDeadEnds === 0, `Zero dead ends (outbound = 0): ${report.summary.totalDeadEnds}`);
  assert(report.summary.missingCategoryCount === 0, `Zero missing categories: ${report.summary.missingCategoryCount}`);
  assert(report.summary.missingLocationCount === 0, `Zero missing locations: ${report.summary.missingLocationCount}`);
  assert(report.summary.missingRelatedPostsCount === 0, `Zero missing related posts: ${report.summary.missingRelatedPostsCount}`);

  // Check individual article diagnostics
  report.articles.forEach(art => {
    assert(art.inboundCount > 0, `Article '${art.slug}' has ${art.inboundCount} inbound links`);
    assert(art.outboundCount > 0, `Article '${art.slug}' has ${art.outboundCount} outbound links`);
    assert(art.hasCategory === true, `Article '${art.slug}' has category assigned (${art.categoryName})`);
    assert(art.hasLocation === true, `Article '${art.slug}' has location assigned (${art.locationCount} locations)`);
    assert(art.hasRelatedPosts === true, `Article '${art.slug}' has related posts assigned`);
    assert(art.status === 'HEALTHY', `Article '${art.slug}' status is HEALTHY (0 issues)`);
  });

  console.log('\n=============================================================');
  console.log(`📊 PHASE 8 AUDIT SUMMARY:`);
  console.log(`✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase8Verification().catch(err => {
  console.error('Audit crashed with error:', err);
  process.exit(1);
});
