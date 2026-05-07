import { validationResult } from 'express-validator';

/**
 * Middleware que verifica los resultados de express-validator
 * y devuelve los errores en un formato uniforme.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: messages
    });
  }
  next();
};
