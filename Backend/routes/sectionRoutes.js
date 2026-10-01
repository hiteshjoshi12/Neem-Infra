import express from 'express';
import {
  getAllSections,
  getSectionByKey,
  updateSection
} from '../controllers/sectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllSections);
router.get('/:sectionKey', getSectionByKey);
router.put('/:sectionKey', protect, updateSection);

export default router;
