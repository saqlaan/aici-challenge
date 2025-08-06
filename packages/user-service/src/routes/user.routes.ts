import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.post('/verify-token', userController.verifyToken);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);

export default router;
