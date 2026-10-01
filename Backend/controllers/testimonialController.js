import Testimonial from '../models/Testimonial.js';

// @desc   Get all testimonials
// @route  GET /api/testimonials
// @access Public
export const getTestimonials = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all ? {} : { isActive: true };

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new testimonial
// @route  POST /api/testimonials
// @access Private (Admin)
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Update testimonial
// @route  PUT /api/testimonials/:id
// @access Private (Admin)
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete testimonial
// @route  DELETE /api/testimonials/:id
// @access Private (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
