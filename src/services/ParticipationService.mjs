import ParticipationRepository from '../repositories/ParticipationRepository.mjs';
import StudyRepository from '../repositories/StudyRepository.mjs';
import crypto from 'crypto';

const ParticipationService = {
  /**
   * Iniciar una nueva participación en un estudio
   */
  async startParticipation({ studyLink, userId = null, deviceInfo = {}, consentGiven = false }) {
    const study = await StudyRepository.findByShareableLink(studyLink);
    if (!study) {
      const error = new Error('Estudio no encontrado o no disponible');
      error.statusCode = 404;
      throw error;
    }

    if (!consentGiven) {
      const error = new Error('Debes dar consentimiento para participar');
      error.statusCode = 400;
      throw error;
    }

    // Evitar participaciones duplicadas del mismo usuario registrado
    if (userId) {
      const existing = await ParticipationRepository.findByUser(userId);
      const alreadyParticipated = existing.some(
        p => p.studyId._id.toString() === study._id.toString() && p.status === 'completed'
      );
      if (alreadyParticipated) {
        const error = new Error('Ya completaste este estudio');
        error.statusCode = 409;
        throw error;
      }
    }

    const anonymousId = userId ? null : crypto.randomUUID();

    const participation = await ParticipationRepository.create({
      studyId: study._id,
      userId,
      anonymousId,
      deviceInfo,
      consentGiven,
      status: 'started',
      startedAt: new Date()
    });

    return {
      participationId: participation._id,
      anonymousId: participation.anonymousId,
      study: {
        title: study.title,
        description: study.description,
        type: study.type,
        cards: study.cards,
        predefinedCategories: study.predefinedCategories,
        settings: study.settings
      }
    };
  },

  /**
   * Completar una participación
   */
  async completeParticipation(id, sortingData) {
    const participation = await ParticipationRepository.findById(id);
    if (!participation) {
      const error = new Error('Participación no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (participation.status === 'completed') {
      const error = new Error('Esta participación ya fue completada');
      error.statusCode = 400;
      throw error;
    }

    const completed = await ParticipationRepository.complete(id, sortingData);

    // Incrementar contador en el estudio
    await StudyRepository.addParticipant(participation.studyId._id);

    return completed;
  },

  /**
   * Obtener detalle de una participación
   */
  async getParticipation(id) {
    const participation = await ParticipationRepository.findById(id);
    if (!participation) {
      const error = new Error('Participación no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return participation;
  },

  /**
   * Listar participaciones de un estudio (para el creador)
   */
  async listStudyParticipations(studyId, userId, statusFilter = null) {
    const study = await StudyRepository.findById(studyId);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para ver estas participaciones');
      error.statusCode = 403;
      throw error;
    }

    const participations = await ParticipationRepository.findByStudy(studyId, statusFilter);
    const total = await ParticipationRepository.count({ studyId });

    return { participations, total };
  },

  /**
   * Obtener resultados de un estudio para análisis (solo el creador)
   */
  async getStudyResults(studyId, userId) {
    const study = await StudyRepository.findById(studyId);
    if (!study) {
      const error = new Error('Estudio no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (study.createdBy._id.toString() !== userId) {
      const error = new Error('No tienes permiso para ver estos resultados');
      error.statusCode = 403;
      throw error;
    }

    const results = await ParticipationRepository.getStudyResults(studyId);

    // Procesar datos para análisis
    const matrix = {};
    let totalTime = 0;

    results.forEach(p => {
      if (p.sortingResult?.assignments) {
        for (const [cardId, categoryId] of p.sortingResult.assignments) {
          if (!matrix[cardId]) matrix[cardId] = {};
          matrix[cardId][categoryId] = (matrix[cardId][categoryId] || 0) + 1;
        }
      }
      if (p.sortingResult?.timeSpent) {
        totalTime += p.sortingResult.timeSpent;
      }
    });

    return {
      studyTitle: study.title,
      totalResponses: results.length,
      averageTime: results.length > 0 ? Math.round(totalTime / results.length) : 0,
      coOccurrenceMatrix: matrix,
      results
    };
  },

  /**
   * Abandonar una participación
   */
  async abandonParticipation(id) {
    const participation = await ParticipationRepository.update(id, {
      status: 'abandoned'
    });
    if (!participation) {
      const error = new Error('Participación no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return participation;
  }
};

export default ParticipationService;
