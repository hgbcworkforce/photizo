import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router = Router();

// POST /api/webhooks/paystack
router.post('/paystack', webhookController.handlePaystackWebhook);

export default router;
