import AuthService from '../services/AuthService.mjs';
import { generateToken } from '../routes/middleware/authMiddleware.mjs';

const AuthController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      const token = generateToken(user);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      const user = await AuthService.login(email, password);
      const token = generateToken(user);
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id; // Se asigna desde el middleware de autenticación

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva son obligatorias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await AuthService.changePassword(userId, currentPassword, newPassword);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};

export default AuthController;
