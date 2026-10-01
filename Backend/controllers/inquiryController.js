import Inquiry from '../models/Inquiry.js';

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
