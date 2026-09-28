import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protect all admin endpoints with Supabase Auth Middleware
router.use(requireAuth as any);

// Dashboard metrics
router.get('/metrics', adminController.getDashboardMetrics as any);

// Attendees CRUD
router.get('/attendees', adminController.getAttendees as any);
router.get('/attendees/export/csv', adminController.exportAttendeesCsv as any);
router.get('/attendees/:id', adminController.getAttendeeById as any);
router.put('/attendees/:id', adminController.updateAttendee as any);
router.delete('/attendees/:id', adminController.deleteAttendee as any);
router.post('/attendees/:id/resend-email', adminController.resendConfirmationEmail as any);

// Merchandise Orders CRUD
router.get('/merchandise/orders', adminController.getMerchandiseOrders as any);
router.get('/merchandise/orders/export/csv', adminController.exportMerchandiseOrdersCsv as any);
router.put('/merchandise/orders/:id', adminController.updateMerchandiseOrder as any);
router.delete('/merchandise/orders/:id', adminController.deleteMerchandiseOrder as any);
router.post('/merchandise/orders/:id/resend-email', adminController.resendMerchandiseEmail as any);

// Payments log
router.get('/payments', adminController.getPayments as any);

export default router;
