import { Router } from 'express';
import { BenefitStatController } from '../controllers/benefit-stat.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { detectLocale } from '../middlewares/locale.middleware';

const router = Router();

// Public routes
router.get('/', detectLocale, BenefitStatController.listPublicStats);

// Admin routes
router.get('/admin', authenticate, BenefitStatController.listAllStats);
router.post('/admin', authenticate, BenefitStatController.createStat);
router.put('/admin/:id', authenticate, BenefitStatController.updateStat);
router.delete('/admin/:id', authenticate, BenefitStatController.deleteStat);

export default router;
