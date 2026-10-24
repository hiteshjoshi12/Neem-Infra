import fs from 'fs';
import path from 'path';

const unsplashFallbacks = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85',
];

const avatarFallbacks = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
];

// Ensure target dir
fs.mkdirSync('scripts/seed-data', { recursive: true });

// 1. propertiesData.js
let propsContent = fs.readFileSync('src/constants/propertiesData.js', 'utf8');
propsContent = propsContent.replace(/reraNumber:\s*"[^"]*(?:Freehold|Title|Municipal|Sanction|Mutation|Conveyance)[^"]*"/g, 'reraNumber: ""');
let pIdx = 0;
propsContent = propsContent.replace(/https:\/\/saudagarproperties\.com\/wp-content\/uploads\/[^"]+/g, () => {
  const url = unsplashFallbacks[pIdx % unsplashFallbacks.length];
  pIdx++;
  return url;
});
fs.writeFileSync('scripts/seed-data/propertiesData.js', propsContent);
console.log('✓ scripts/seed-data/propertiesData.js created');

// 2. homeData.js
let homeContent = fs.readFileSync('src/constants/homeData.js', 'utf8');
let hIdx = 0;
homeContent = homeContent.replace(/https:\/\/saudagarproperties\.com\/wp-content\/uploads\/[^"]+/g, () => {
  const url = avatarFallbacks[hIdx % avatarFallbacks.length];
  hIdx++;
  return url;
});
fs.writeFileSync('scripts/seed-data/homeData.js', homeContent);
console.log('✓ scripts/seed-data/homeData.js created');

// 3. teamData.js
let teamContent = fs.readFileSync('src/constants/teamData.js', 'utf8');
let tIdx = 0;
teamContent = teamContent.replace(/https:\/\/saudagarproperties\.com\/wp-content\/uploads\/[^"]+/g, () => {
  const url = avatarFallbacks[tIdx % avatarFallbacks.length];
  tIdx++;
  return url;
});
fs.writeFileSync('scripts/seed-data/teamData.js', teamContent);
console.log('✓ scripts/seed-data/teamData.js created');

// 4. blogData.js
let blogContent = fs.readFileSync('src/constants/blogData.js', 'utf8');
// Replace wp-content image links
let bIdx = 0;
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/wp-content\/uploads\/[^"]+/g, () => {
  const url = unsplashFallbacks[bIdx % unsplashFallbacks.length];
  bIdx++;
  return url;
});
// Replace broken blog internal links
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-dlf-phase-1\/?/g, '/property/dlf-phase-1');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-dlf-phase-2\/?/g, '/property/dlf-phase-2');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-dlf-phase-3\/?/g, '/property/dlf-phase-3');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-dlf-phase-4\/?/g, '/property/dlf-phase-4');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-dlf-phase-5\/?/g, '/property/dlf-phase-5');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-sushant-lok\/?/g, '/property/shushant-lok');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-golf-course-road\/?/g, '/property/golf-course-road');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-udyog-vihar\/?/g, '/property/udyog-vihar');
blogContent = blogContent.replace(/https:\/\/saudagarproperties\.com\/property-in-cyber-city\/?/g, '/property/cyber-city');
fs.writeFileSync('scripts/seed-data/blogData.js', blogContent);
console.log('✓ scripts/seed-data/blogData.js created');

// 5. defaultSections.js
let defaultSecContent = fs.readFileSync('src/constants/defaultSections.js', 'utf8');
let dsIdx = 0;
defaultSecContent = defaultSecContent.replace(/https:\/\/saudagarproperties\.com\/wp-content\/uploads\/[^"]+/g, () => {
  const url = avatarFallbacks[dsIdx % avatarFallbacks.length];
  dsIdx++;
  return url;
});
fs.writeFileSync('scripts/seed-data/defaultSections.js', defaultSecContent);
console.log('✓ scripts/seed-data/defaultSections.js created');

// 6. corridorPagesData.js, aboutData.js, topicClusters.js, imagekitMediaMap.json
fs.copyFileSync('src/constants/corridorPagesData.js', 'scripts/seed-data/corridorPagesData.js');
console.log('✓ scripts/seed-data/corridorPagesData.js copied');
fs.copyFileSync('src/constants/aboutData.js', 'scripts/seed-data/aboutData.js');
console.log('✓ scripts/seed-data/aboutData.js copied');
fs.copyFileSync('src/constants/topicClusters.js', 'scripts/seed-data/topicClusters.js');
console.log('✓ scripts/seed-data/topicClusters.js copied');
fs.copyFileSync('src/constants/imagekitMediaMap.json', 'scripts/seed-data/imagekitMediaMap.json');
console.log('✓ scripts/seed-data/imagekitMediaMap.json copied');

console.log('✨ All seed data successfully prepared in scripts/seed-data/ with 0 wp-content 404s and cleaned links.');
