import User from '../models/User.mjs';

const UserRepository = {
  /**
   * Obtener todos los usuarios
   */
  findAll(filter = {}) {
    return User.find(filter).select('-password');
  },

  /**
   * Buscar usuario por ID (excluye password por defecto)
   */
  findById(id, includePassword = false) {
    const query = User.findById(id);
    return includePassword ? query : query.select('-password');
  },

  /**
   * Buscar usuario por email
   */
  findByEmail(email) {
    return User.findOne({ email }).select('+password');
  },

  /**
   * Crear un nuevo usuario
   */
  create(userData) {
    return User.create(userData);
  },

  /**
   * Actualizar un usuario por ID
   */
  update(id, userData) {
    return User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    }).select('-password');
  },

  /**
   * Eliminar un usuario por ID
   */
  delete(id) {
    return User.findByIdAndDelete(id);
  },

  /**
   * Buscar usuarios por rol
   */
  findByRole(role) {
    return User.find({ role }).select('-password');
  },

  /**
   * Contar usuarios
   */
  count(filter = {}) {
    return User.countDocuments(filter);
  }
};

export default UserRepository;
