import UserRepository from '../repositories/UserRepository.mjs';

const UserService = {
  /**
   * Obtener perfil público de un usuario
   */
  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  /**
   * Actualizar perfil (nombre, organización, etc.)
   */
  async updateProfile(userId, updateData) {
    const allowedFields = ['name', 'organization'];
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const user = await UserRepository.update(userId, filteredData);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  /**
   * Listar usuarios (solo admin)
   */
  async listUsers(filters = {}) {
    const allowedFilters = {};
    if (filters.role) allowedFilters.role = filters.role;
    if (filters.isActive !== undefined) allowedFilters.isActive = filters.isActive;

    const users = await UserRepository.findAll(allowedFilters);
    const total = await UserRepository.count(allowedFilters);

    return { users, total };
  },

  /**
   * Desactivar un usuario (solo admin)
   */
  async deactivateUser(userId) {
    const user = await UserRepository.update(userId, { isActive: false });
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  /**
   * Eliminar un usuario
   */
  async deleteUser(userId) {
    const user = await UserRepository.delete(userId);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Usuario eliminado correctamente' };
  }
};

export default UserService;
