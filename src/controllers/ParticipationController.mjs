import ParticipationService from '../services/ParticipationService.mjs';

const ParticipationController = {
  /**
   * POST /api/participations/start
   */
  async start(req, res, next) {
    try {
      const { studyLink, consentGiven } = req.body;

      if (!studyLink) {
        return res.status(400).json({
          success: false,
          message: 'El link del estudio es obligatorio'
        });
      }

      const result = await ParticipationService.startParticipation({
        studyLink,
        userId: req.user?.id || null,
        deviceInfo: {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          browser: req.get('User-Agent'),
          os: req.get('User-Agent')
        },
        consentGiven: consentGiven || false
      });

      res.status(201).json({
        success: true,
        message: 'Participación iniciada',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/participations/:id/complete
   */
  async complete(req, res, next) {
    try {
      const { assignments, customCategories, cardOrder, comments, difficulty } = req.body;

      if (!assignments) {
        return res.status(400).json({
          success: false,
          message: 'Los resultados del ordenamiento son obligatorios'
        });
      }

      const participation = await ParticipationService.completeParticipation(req.params.id, {
        assignments,
        customCategories,
        cardOrder,
        comments,
        difficulty
      });

      res.json({
        success: true,
        message: 'Participación completada. ¡Gracias!',
        data: participation
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/participations/:id
   */
  async getById(req, res, next) {
    try {
      const participation = await ParticipationService.getParticipation(req.params.id);
      res.json({
        success: true,
        data: participation
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies/:studyId/participations
   */
  async listByStudy(req, res, next) {
    try {
      const { status } = req.query;
      const result = await ParticipationService.listStudyParticipations(
        req.params.studyId,
        req.user.id,
        status
      );
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies/:studyId/results
   */
  async getStudyResults(req, res, next) {
    try {
      const results = await ParticipationService.getStudyResults(
        req.params.studyId,
        req.user.id
      );
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/participations/:id/abandon
   */
  async abandon(req, res, next) {
    try {
      const participation = await ParticipationService.abandonParticipation(req.params.id);
      res.json({
        success: true,
        message: 'Participación abandonada',
        data: participation
      });
    } catch (error) {
      next(error);
    }
  }
};

export default ParticipationController;
