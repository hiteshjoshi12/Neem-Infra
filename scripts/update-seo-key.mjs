import { connectDB } from '../src/lib/mongodb.js';
import SeoSettings from '../src/models/SeoSettings.js';

async function update() {
  await connectDB();
  const res = await SeoSettings.findOneAndUpdate(
    { singletonKey: 'global_seo_settings' },
    {
      indexNowKey: '23c1fd3e813a48e78e6da5a6e2e50550',
      indexNowKeyLocation: 'https://saudagarproperties.com/23c1fd3e813a48e78e6da5a6e2e50550.txt'
    },
    { returnDocument: 'after' }
  );
  console.log('SAVED_INDEXNOW_KEY:', res.indexNowKey);
  console.log('SAVED_KEY_LOCATION:', res.indexNowKeyLocation);
  process.exit(0);
}

update();
