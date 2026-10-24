async function extract() {
  const [h1, h2] = await Promise.all([
    fetch('http://localhost:3000/', { headers: { Host: 'saudagarproperties.com' } }).then(r => r.text()),
    fetch('http://localhost:3000/properties/4-bhk-independent-floor-dlf-phase1', { headers: { Host: 'saudagarproperties.com' } }).then(r => r.text())
  ]);

  const orgMatches = [...h1.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  console.log('=== REAL ORGANIZATION JSON-LD ===');
  for (const m of orgMatches) {
    if (m[1].includes('"@type":"RealEstateAgent"') || m[1].includes('"@type": "RealEstateAgent"') || m[1].includes('Organization')) {
      try {
        console.log(JSON.stringify(JSON.parse(m[1]), null, 2));
      } catch (e) {
        console.log(m[1]);
      }
      break;
    }
  }

  const propMatches = [...h2.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  console.log('\n=== REAL PROPERTY JSON-LD ===');
  for (const m of propMatches) {
    if (m[1].includes('"@type":"RealEstateListing"') || m[1].includes('"@type":"Product"') || m[1].includes('"@type":"SingleFamilyResidence"')) {
      try {
        console.log(JSON.stringify(JSON.parse(m[1]), null, 2));
      } catch (e) {
        console.log(m[1]);
      }
      break;
    }
  }
}

extract().catch(console.error);
