import { Router } from 'express';
import { ProcessStepController } from '../controllers/process-step.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { detectLocale } from '../middlewares/locale.middleware';

const router = Router();

// Public routes
router.get('/', detectLocale, ProcessStepController.listPublicSteps);

// Admin routes
router.get('/admin', authenticate, ProcessStepController.listAllSteps);
router.post('/admin', authenticate, ProcessStepController.createStep);
router.put('/admin/:id', authenticate, ProcessStepController.updateStep);
router.delete('/admin/:id', authenticate, ProcessStepController.deleteStep);

export default router;
