import { Router } from 'express';
import registrationRoutes from './registration.routes';
import merchandiseRoutes from './merchandise.routes';
import paymentRoutes from './payment.routes';
import webhookRoutes from './webhook.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health Check Endpoint (For Render Zero-Downtime Monitoring)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'bisum-backend',
    version: '1.0.0',
  });
});

// Mount domain routes
router.use('/registration', registrationRoutes);
router.use('/merchandise', merchandiseRoutes);
router.use('/payments', paymentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/admin', adminRoutes);

export default router;
