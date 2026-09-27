import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;
