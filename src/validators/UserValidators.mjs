import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../routes/errorMiddleware/validationMiddleware.mjs';

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('organization')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La organización no puede exceder 100 caracteres'),

  handleValidationErrors
];

export const validateUserId = [
  param('id')
    .isMongoId().withMessage('ID de usuario inválido'),

  handleValidationErrors
];

export const validateListUsers = [
  query('role')
    .optional()
    .isIn(['admin', 'researcher', 'participant']).withMessage('Rol inválido'),

  query('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser true o false'),

  handleValidationErrors
];
