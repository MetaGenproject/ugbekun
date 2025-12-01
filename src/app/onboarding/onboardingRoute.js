import express from 'express';
import { onboardSchool } from '../controllers/onboardingController.js';
// import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/school', /* protect, authorize('super_admin'), */ onboardSchool);

export default router;