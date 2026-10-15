import { sendInquiryNotification } from '../src/lib/email/emailService.js';
import mongoose from 'mongoose';
import Inquiry from '../src/models/Inquiry.js';

async function testEmailInquiry() {
  console.log('\n=============================================================');
  console.log('🧪 TESTING INQUIRY & EMAIL NOTIFICATION PIPELINE');
  console.log('=============================================================\n');

  // Test 1: Notification Formatting & Delivery fallback
  console.log('Test 1: Testing sendInquiryNotification fallback & HTML generation...');
  const sampleInquiry = {
    _id: new mongoose.Types.ObjectId(),
    type: 'property_inquiry',
    propertyTitle: '4 BHK Luxury Builder Floor DLF Phase 2',
    name: 'Vikramaditya Singhania',
    phone: '+91 98765 43210',
    email: 'vikram.singhania@example.com',
    preferredDate: '2026-03-28',
    source: 'Property Detail - 4 BHK Luxury Builder Floor',
    message: 'Requesting private inspection for family. Need verified floor plans and deed records.'
  };

  const result = await sendInquiryNotification(sampleInquiry);
  console.log('✓ sendInquiryNotification returned:', result);

  if (result.success) {
    console.log('  ✅ PASS: Email notification service executed successfully');
  } else {
    console.error('  ❌ FAIL: Email notification service crashed');
    process.exit(1);
  }

  // Test 2: Newsletter type
  console.log('\nTest 2: Testing newsletter notification format...');
  const sampleNewsletter = {
    _id: new mongoose.Types.ObjectId(),
    type: 'newsletter',
    email: 'investor.dubai@familyoffice.ae',
    source: 'Homepage Newsletter Section',
    message: 'Subscriber joined the private newsletter.'
  };

  const result2 = await sendInquiryNotification(sampleNewsletter);
  if (result2.success) {
    console.log('  ✅ PASS: Newsletter notification format generated cleanly');
  } else {
    console.error('  ❌ FAIL: Newsletter notification failed');
    process.exit(1);
  }

  console.log('\n=============================================================');
  console.log('🎉 ALL INQUIRY EMAIL NOTIFICATION TESTS PASSED');
  console.log('=============================================================\n');
}

testEmailInquiry().catch(err => {
  console.error('Test crashed:', err);
  process.exit(1);
});
