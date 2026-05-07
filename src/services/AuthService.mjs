import UserRepository from '../repositories/UserRepository.mjs';

const AuthService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(userData) {
    const { email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('El email ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const user = await UserRepository.create(userData);
    return user;
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Cuenta desactivada. Contacta al administrador.');
      error.statusCode = 403;
      throw error;
    }

    return user;
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId, true);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error('La contraseña actual es incorrecta');
      error.statusCode = 401;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Contraseña actualizada correctamente' };
  }
};

export default AuthService;
