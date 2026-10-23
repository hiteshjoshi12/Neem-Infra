import mongoose from 'mongoose';

async function updateFooter() {
  await mongoose.connect(process.env.MONGO_URI);
  const footerDoc = await mongoose.connection.collection('sectioncontents').findOne({ sectionKey: 'footer' });
  if (footerDoc && footerDoc.data) {
    const legal = footerDoc.data.legalLinks || [];
    if (!legal.some(l => l.href === '/admin')) {
      legal.push({ label: 'Admin Panel', href: '/admin' });
      await mongoose.connection.collection('sectioncontents').updateOne(
        { sectionKey: 'footer' },
        { $set: { 'data.legalLinks': legal } }
      );
      console.log('Updated MongoDB sectioncontents footer legalLinks:', legal);
    } else {
      console.log('Admin link already present in MongoDB sectioncontents footer');
    }
  }
  await mongoose.disconnect();
}
updateFooter().catch(console.error);
