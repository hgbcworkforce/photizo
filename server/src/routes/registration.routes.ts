import { Router } from 'express';
import { registrationController, registrationSchema } from '../controllers/registration.controller';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();

// POST /api/registration/initiate or POST /api/registrations
router.post('/initiate', validateBody(registrationSchema), registrationController.initiate);
router.post('/', validateBody(registrationSchema), registrationController.initiate);

// GET /api/registration/status/:reference
router.get('/status/:reference', registrationController.getStatus);

export default router;
