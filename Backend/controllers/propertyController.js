import Property from '../models/Property.js';

// @desc   Get all properties
// @route  GET /api/properties
// @access Public
export const getProperties = async (req, res) => {
  try {
    const { category, isFeatured, all } = req.query;
    const filter = {};

    // By default for public, only return active properties unless 'all=true' (for admin)
    if (!all) {
      filter.isActive = true;
    }
    if (category) {
      filter.category = category;
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single property
// @route  GET /api/properties/:id
// @access Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new property
// @route  POST /api/properties
// @access Private (Admin)
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Update property
// @route  PUT /api/properties/:id
// @access Private (Admin)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete property
// @route  DELETE /api/properties/:id
// @access Private (Admin)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
