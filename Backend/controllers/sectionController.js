import SectionContent from '../models/SectionContent.js';

// @desc   Get all homepage sections content
// @route  GET /api/sections
// @access Public
export const getAllSections = async (req, res) => {
  try {
    const sections = await SectionContent.find({});
    // Convert array into a dictionary map { [sectionKey]: data } for easy frontend consumption
    const sectionMap = {};
    sections.forEach((item) => {
      sectionMap[item.sectionKey] = item.data;
    });

    res.json({
      success: true,
      data: sectionMap,
      raw: sections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single section by key (e.g. 'hero', 'topConsultant')
// @route  GET /api/sections/:sectionKey
// @access Public
export const getSectionByKey = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const section = await SectionContent.findOne({ sectionKey });

    if (!section) {
      return res.status(404).json({ success: false, message: `Section '${sectionKey}' not found` });
    }

    res.json({
      success: true,
      data: section.data,
      sectionKey: section.sectionKey,
      updatedAt: section.updatedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update or Create (upsert) section content
// @route  PUT /api/sections/:sectionKey
// @access Private (Admin)
export const updateSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { data, title } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Please provide section data' });
    }

    const updatedSection = await SectionContent.findOneAndUpdate(
      { sectionKey },
      {
        sectionKey,
        title: title || sectionKey,
        data,
        lastUpdatedBy: req.admin?.name || 'Admin'
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Section '${sectionKey}' updated successfully`,
      data: updatedSection.data,
      sectionKey: updatedSection.sectionKey
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
