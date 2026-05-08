import { Router } from 'express';
import AuthController from '../controllers/AuthController.mjs';
import {
  validateRegister,
  validateLogin,
  validateChangePassword
} from '../validators/AuthValidators.mjs';
import { authenticate } from '../routes/middleware/authMiddleware.mjs';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.put('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

export default router;
