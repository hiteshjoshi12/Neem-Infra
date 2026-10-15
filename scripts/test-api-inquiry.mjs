import mongoose from 'mongoose';
import Inquiry from '../src/models/Inquiry.js';

async function testApiInquiry() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING INQUIRY MODEL & MONGO PERSISTENCE');
  console.log('=============================================================\n');

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✓ Connected to MongoDB Atlas');

  // Insert test lead
  const testLead = await Inquiry.create({
    type: 'viewing_request',
    name: 'Test Lead Delivery',
    email: 'test.lead@saudagarproperties.com',
    phone: '+91 99999 88888',
    propertyTitle: 'Bespoke Penthouse DLF Phase 5',
    preferredDate: '2026-04-01',
    source: 'Automated Test Suite',
    message: 'Testing lead delivery and email dispatch.',
    status: 'new'
  });

  console.log('✓ Created test lead in MongoDB with ID:', testLead._id);

  // Retrieve lead
  const found = await Inquiry.findById(testLead._id);
  if (found && found.propertyTitle === 'Bespoke Penthouse DLF Phase 5') {
    console.log('  ✅ PASS: Inquiry successfully retrieved from MongoDB with custom fields intact');
  } else {
    console.error('  ❌ FAIL: Inquiry could not be retrieved');
    process.exit(1);
  }

  // Cleanup test lead
  await Inquiry.deleteOne({ _id: testLead._id });
  console.log('✓ Cleaned up test lead from MongoDB');

  await mongoose.disconnect();
  console.log('✓ MongoDB disconnected\n');
}

testApiInquiry().catch(err => {
  console.error('Persistence test failed:', err);
  process.exit(1);
});
