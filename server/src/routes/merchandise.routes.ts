import { Router } from 'express';
import { merchandiseController, merchandiseOrderSchema } from '../controllers/merchandise.controller';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();

// POST /api/merchandise/initiate or POST /api/orders/merchandise
router.post('/initiate', validateBody(merchandiseOrderSchema), merchandiseController.initiate);
router.post('/', validateBody(merchandiseOrderSchema), merchandiseController.initiate);

// GET /api/merchandise/status/:reference
router.get('/status/:reference', merchandiseController.getStatus);

export default router;
