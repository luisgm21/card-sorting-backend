import { Router } from 'express';
import UserController from '../controllers/UserController.mjs';
import {
  validateUpdateProfile,
  validateUserId,
  validateListUsers
} from '../validators/UserValidators.mjs';
import { authenticate, authorize } from '../routes/middleware/authMiddleware.mjs';

const router = Router();

router.use(authenticate); // Todas las rutas de usuarios requieren autenticación

router.get('/', authorize('admin'), validateListUsers, UserController.listUsers);
router.get('/profile', UserController.getProfile);
router.put('/profile', validateUpdateProfile, UserController.updateProfile);
router.get('/:id', authorize('admin'), validateUserId, UserController.getUserById);
router.patch('/:id/deactivate', authorize('admin'), validateUserId, UserController.deactivateUser);
router.delete('/:id', authorize('admin'), validateUserId, UserController.deleteUser);

export default router;
