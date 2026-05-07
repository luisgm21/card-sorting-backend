import { Router } from 'express';
import authRoutes from './authRoutes.mjs';
import userRoutes from './userRoutes.mjs';
import studyRoutes from './studyRoutes.mjs';
import participationRoutes from './participationRoutes.mjs';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/studies', studyRoutes);
router.use('/participations', participationRoutes);

export default router;
