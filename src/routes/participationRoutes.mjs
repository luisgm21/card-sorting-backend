import { Router } from 'express';
import ParticipationController from '../controllers/ParticipationController.mjs';
import {
  validateStartParticipation,
  validateCompleteParticipation,
  validateParticipationId,
  validateListParticipations,
  validateStudyResults
} from '../validators/ParticipationValidators.mjs';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.mjs';

const router = Router();

// Rutas públicas (con autenticación opcional para usuarios registrados)
router.post('/start', optionalAuth, validateStartParticipation, ParticipationController.start);

// Rutas de estudio + participaciones (protegidas)
router.get('/studies/:studyId/participations', authenticate, validateListParticipations, ParticipationController.listByStudy);
router.get('/studies/:studyId/results', authenticate, validateStudyResults, ParticipationController.getStudyResults);

// Rutas de participación individual
router.get('/:id', authenticate, validateParticipationId, ParticipationController.getById);
router.put('/:id/complete', validateCompleteParticipation, ParticipationController.complete);
router.patch('/:id/abandon', authenticate, validateParticipationId, ParticipationController.abandon);

export default router;
