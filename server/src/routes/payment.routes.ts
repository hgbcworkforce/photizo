import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// GET /api/payments/verify/:reference
router.get('/verify/:reference', paymentController.verifyPayment);

export default router;
