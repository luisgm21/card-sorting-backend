import StudyService from '../services/StudyService.mjs';

const StudyController = {
  /**
   * POST /api/studies
   */
  async create(req, res, next) {
    try {
      const study = await StudyService.createStudy(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Estudio creado correctamente',
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies/:id
   */
  async getById(req, res, next) {
    try {
      const study = await StudyService.getStudy(req.params.id);
      res.json({
        success: true,
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies/public/:link
   */
  async getPublicByLink(req, res, next) {
    try {
      const study = await StudyService.getPublicStudy(req.params.link);
      res.json({
        success: true,
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/studies/:id
   */
  async update(req, res, next) {
    try {
      const study = await StudyService.updateStudy(req.params.id, req.body, req.user.id);
      res.json({
        success: true,
        message: 'Estudio actualizado correctamente',
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/studies/:id/publish
   */
  async publish(req, res, next) {
    try {
      const study = await StudyService.publishStudy(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Estudio publicado correctamente',
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/studies/:id/close
   */
  async close(req, res, next) {
    try {
      const study = await StudyService.closeStudy(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Estudio cerrado correctamente',
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/studies/:id/archive
   */
  async archive(req, res, next) {
    try {
      const study = await StudyService.archiveStudy(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Estudio archivado correctamente',
        data: study
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/studies/:id
   */
  async remove(req, res, next) {
    try {
      await StudyService.deleteStudy(req.params.id, req.user.id);
      res.json({
        success: true,
        message: 'Estudio eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies
   */
  async list(req, res, next) {
    try {
      const { status, type, createdBy } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (type) filters.type = type;

      // Si es un usuario normal, solo ve sus propios estudios
      const userId = req.user.role === 'admin' && createdBy ? createdBy : req.user.id;

      const result = await StudyService.listStudies(filters, userId);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/studies/:id/analytics
   */
  async getAnalytics(req, res, next) {
    try {
      const analytics = await StudyService.getStudyAnalytics(req.params.id, req.user.id);
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }
};

export default StudyController;
