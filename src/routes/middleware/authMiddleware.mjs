import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.mjs';

const JWT_SECRET = process.env.JWT_SECRET || 'card-sorting-secret-dev';

/**
 * Genera un token JWT para el usuario
 */
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Middleware que verifica el token JWT y carga el usuario en req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    next(error);
  }
};

/**
 * Middleware que permite el acceso solo a roles específicos
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }
    next();
  };
};

/**
 * Middleware opcional: si hay token, lo decodifica;
 * si no, continúa igual (para endpoints públicos con usuario opcional)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserRepository.findById(decoded.id);

      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role
        };
      }
    }
  } catch {
    // Si el token es inválido, simplemente no hay req.user
  }

  next();
};
