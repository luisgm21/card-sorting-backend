import Participation from '../models/Participation.mjs';

const ParticipationRepository = {
  /**
   * Obtener todas las participaciones
   */
  findAll(filter = {}) {
    return Participation.find(filter)
      .populate('studyId', 'title')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar participación por ID
   */
  findById(id) {
    return Participation.findById(id)
      .populate('studyId', 'title type cards')
      .populate('userId', 'name email');
  },

  /**
   * Crear una nueva participación
   */
  create(participationData) {
    return Participation.create(participationData);
  },

  /**
   * Actualizar una participación por ID
   */
  update(id, data) {
    return Participation.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).populate('studyId', 'title');
  },

  /**
   * Eliminar una participación por ID
   */
  delete(id) {
    return Participation.findByIdAndDelete(id);
  },

  /**
   * Buscar participaciones de un estudio
   */
  findByStudy(studyId, status = null) {
    const filter = { studyId };
    if (status) filter.status = status;
    return Participation.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar participaciones de un usuario
   */
  findByUser(userId) {
    return Participation.find({ userId })
      .populate('studyId', 'title type')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar participación anónima por ID único
   */
  findByAnonymousId(anonymousId) {
    return Participation.findOne({ anonymousId })
      .populate('studyId', 'title');
  },

  /**
   * Obtener resultados completos de un estudio para análisis
   */
  getStudyResults(studyId) {
    return Participation.find({
      studyId,
      status: 'completed'
    }).select('sortingResult startedAt completedAt deviceInfo');
  },

  /**
   * Marcar participación como completada
   */
  complete(id, sortingData) {
    return Participation.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        completedAt: new Date(),
        'sortingResult.assignments': sortingData.assignments,
        'sortingResult.customCategories': sortingData.customCategories,
        'sortingResult.cardOrder': sortingData.cardOrder,
        'sortingResult.comments': sortingData.comments,
        'sortingResult.difficulty': sortingData.difficulty
      },
      { new: true }
    );
  },

  /**
   * Contar participaciones
   */
  count(filter = {}) {
    return Participation.countDocuments(filter);
  }
};

export default ParticipationRepository;
