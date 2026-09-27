import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// POST /api/payments/initialize
router.post('/initialize', paymentController.initializePayment);

// GET /api/payments/verify or GET /api/payments/verify/:reference
router.get('/verify', paymentController.verifyPayment);
router.get('/verify/:reference', paymentController.verifyPayment);

export default router;
