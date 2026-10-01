import express from 'express';
import {
  createInquiry,
  getInquiries,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, getInquiries);
router.delete('/:id', protect, deleteInquiry);

export default router;
