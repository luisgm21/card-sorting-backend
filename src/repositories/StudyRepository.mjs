import Study from '../models/Study.mjs';

const StudyRepository = {
  /**
   * Obtener todos los estudios
   */
  findAll(filter = {}) {
    return Study.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar estudio por ID
   */
  findById(id) {
    return Study.findById(id)
      .populate('createdBy', 'name email');
  },

  /**
   * Crear un nuevo estudio
   */
  create(studyData) {
    return Study.create(studyData);
  },

  /**
   * Actualizar un estudio por ID
   */
  update(id, studyData) {
    return Study.findByIdAndUpdate(id, studyData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');
  },

  /**
   * Eliminar un estudio por ID
   */
  delete(id) {
    return Study.findByIdAndDelete(id);
  },

  /**
   * Buscar estudios por estado
   */
  findByStatus(status) {
    return Study.find({ status })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar estudios creados por un usuario
   */
  findByCreator(creatorId) {
    return Study.find({ createdBy: creatorId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  },

  /**
   * Buscar estudio por link compartible
   */
  findByShareableLink(link) {
    return Study.findOne({ shareableLink: link, status: 'published' })
      .select('-createdBy');
  },

  /**
   * Incrementar contador de participantes
   */
  addParticipant(studyId) {
    return Study.findByIdAndUpdate(
      studyId,
      { $inc: { totalParticipants: 1 } },
      { new: true }
    );
  },

  /**
   * Publicar un estudio (cambiar estado a published)
   */
  publish(id) {
    return Study.findByIdAndUpdate(
      id,
      { status: 'published' },
      { new: true }
    );
  },

  /**
   * Contar estudios
   */
  count(filter = {}) {
    return Study.countDocuments(filter);
  }
};

export default StudyRepository;
