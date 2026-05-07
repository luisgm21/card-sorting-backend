import StudyRepository from '../repositories/StudyRepository.mjs';
import ParticipationRepository from '../repositories/ParticipationRepository.mjs';

const StudyService = {
  /**
   * Crear un nuevo estudio
   */
  async createStudy(data, creatorId) {
    if (!data.cards || data.cards.length < 2) {
      const error = new Error('El estudio debe tener al menos 2 tarjetas');
      error.statusCode = 400;
      throw error;
    }

    const studyData = {
      ...data,
      createdBy: creatorId
    };

    if (data.type === 'closed' && (!data.predefinedCategories || data.predefinedCategories.length < 2)) {
      const error = new Error('Un estudio cerrado necesita al menos 2 categorías predefinidas');
      error.statusCode = 400;
      throw error;
    }

    return StudyRepository.create(studyData);
  },

  /**
   * Obtener un estudio por ID (solo para el creador/admin)
   */
  async getStudy(id) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return study;
  },

  /**
   * Obtener estudio público por link compartible (para participantes)
   */
  async getPublicStudy(link) {
    const study = await StudyRepository.findByShareableLink(link);
    if (!study) {
      const error = new Error('Estudio no encontrado o no disponible');
      error.statusCode = 404;
      throw error;
    }
    return study;
  },

  /**
   * Actualizar un estudio (solo si está en draft)
   */
  async updateStudy(id, data, userId) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para modificar este estudio');
      error.statusCode = 403;
      throw error;
    }

    if (study.status !== 'draft') {
      const error = new Error('Solo se puede modificar un estudio en borrador');
      error.statusCode = 400;
      throw error;
    }

    return StudyRepository.update(id, data);
  },

  /**
   * Publicar un estudio
   */
  async publishStudy(id, userId) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para publicar este estudio');
      error.statusCode = 403;
      throw error;
    }

    if (study.status !== 'draft') {
      const error = new Error('El estudio ya fue publicado o está cerrado');
      error.statusCode = 400;
      throw error;
    }

    return StudyRepository.publish(id);
  },

  /**
   * Cerrar un estudio (no acepta más participaciones)
   */
  async closeStudy(id, userId) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para cerrar este estudio');
      error.statusCode = 403;
      throw error;
    }

    return StudyRepository.update(id, { status: 'closed' });
  },

  /**
   * Archivar un estudio
   */
  async archiveStudy(id, userId) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para archivar este estudio');
      error.statusCode = 403;
      throw error;
    }

    return StudyRepository.update(id, { status: 'archived' });
  },

  /**
   * Eliminar un estudio
   */
  async deleteStudy(id, userId) {
    const study = await StudyRepository.findById(id);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para eliminar este estudio');
      error.statusCode = 403;
      throw error;
    }

    return StudyRepository.delete(id);
  },

  /**
   * Listar estudios con filtros
   */
  async listStudies(filters = {}, userId = null) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (userId) query.createdBy = userId;

    const studies = await StudyRepository.findAll(query);
    const total = await StudyRepository.count(query);

    return { studies, total };
  },

  /**
   * Obtener resultados/analíticas de un estudio
   */
  async getStudyAnalytics(studyId, userId) {
    const study = await StudyRepository.findById(studyId);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para ver estas analíticas');
      error.statusCode = 403;
      throw error;
    }

    const totalParticipations = await ParticipationRepository.count({ studyId });
    const completed = await ParticipationRepository.count({ studyId, status: 'completed' });
    const abandoned = await ParticipationRepository.count({ studyId, status: 'abandoned' });

    return {
      study: {
        id: study._id,
        title: study.title,
        type: study.type,
        status: study.status,
        totalParticipants: study.totalParticipants,
        cardsCount: study.cards.length
      },
      participations: {
        total: totalParticipations,
        completed,
        abandoned,
        completionRate: totalParticipations > 0
          ? Math.round((completed / totalParticipations) * 100)
          : 0
      }
    };
  }
};

export default StudyService;
