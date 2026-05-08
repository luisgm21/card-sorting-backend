import { Router } from 'express';
import StudyController from '../controllers/StudyController.mjs';
import {
  validateCreateStudy,
  validateUpdateStudy,
  validateStudyId,
  validatePublicLink,
  validateListStudies
} from '../validators/StudyValidators.mjs';
import { authenticate, authorize } from '../routes/middleware/authMiddleware.mjs';

const router = Router();

router.use(authenticate); // Todas las rutas de estudios requieren autenticación

router.get('/', validateListStudies, StudyController.list);
router.post('/', authorize('admin', 'researcher'), validateCreateStudy, StudyController.create);
router.get('/public/:link', validatePublicLink, StudyController.getPublicByLink);
router.get('/:id', validateStudyId, StudyController.getById);
router.put('/:id', authorize('admin', 'researcher'), validateUpdateStudy, StudyController.update);
router.patch('/:id/publish', authorize('admin', 'researcher'), validateStudyId, StudyController.publish);
router.patch('/:id/close', authorize('admin', 'researcher'), validateStudyId, StudyController.close);
router.patch('/:id/archive', authorize('admin', 'researcher'), validateStudyId, StudyController.archive);
router.delete('/:id', authorize('admin', 'researcher'), validateStudyId, StudyController.remove);
router.get('/:id/analytics', authorize('admin', 'researcher'), validateStudyId, StudyController.getAnalytics);

export default router;
