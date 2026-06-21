import { Router } from 'express';
import { getAIInsightsHub, completeActionTask } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect as any);

router.get('/recommendations', getAIInsightsHub as any);
router.patch('/action/:id', completeActionTask as any);

export default router;