import Inquiry from '../models/Inquiry.js';
import nodemailer from 'nodemailer';

// @desc   Submit inquiry / newsletter lead
// @route  POST /api/inquiries
// @access Public
export const createInquiry = async (req, res) => {
  try {
    const { email, name, phone, message, propertyTitle, type } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const inquiry = await Inquiry.create({
      email,
      name,
      phone,
      message,
      propertyTitle,
      type: type || 'newsletter'
    });

    // Send email notification via Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Default to gmail, can be changed
        auth: {
          user: process.env.SMTP_EMAIL || 'saudagar.properties@yahoo.in',
          pass: process.env.SMTP_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL || 'saudagar.properties@yahoo.in',
        to: 'saudagar.properties@yahoo.in',
        subject: `New Lead: ${type === 'newsletter' ? 'Newsletter Subscription' : 'Property Inquiry'} from ${name || email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #E8E4DA; border-radius: 10px;">
            <h2 style="color: #1D263B; border-bottom: 2px solid #C5A880; padding-bottom: 10px;">New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Type:</strong> ${type || 'N/A'}</p>
            <p><strong>Property Title:</strong> ${propertyTitle || 'N/A'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #FAF8F5; border-radius: 8px;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin-top: 10px; white-space: pre-wrap;">${message || 'N/A'}</p>
            </div>
          </div>
        `
      };

      if (process.env.SMTP_PASSWORD) {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent for inquiry:', inquiry._id);
      } else {
        console.warn('SMTP_PASSWORD not set in .env. Email notification skipped.');
      }
    } catch (mailError) {
      console.error('Error sending email:', mailError);
      // Do not fail the overall request just because the email failed
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully',
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Get all inquiries
// @route  GET /api/inquiries
// @access Private (Admin)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete inquiry
// @route  DELETE /api/inquiries/:id
// @access Private (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
