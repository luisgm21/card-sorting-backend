import { body, param, query } from 'express-validator';
import { handleValidationErrors } from './validationMiddleware.mjs';

export const validateStartParticipation = [
  body('studyLink')
    .trim()
    .notEmpty().withMessage('El link del estudio es obligatorio'),

  body('consentGiven')
    .optional()
    .isBoolean().withMessage('consentGiven debe ser true o false'),

  handleValidationErrors
];

export const validateCompleteParticipation = [
  param('id')
    .isMongoId().withMessage('ID de participación inválido'),

  body('assignments')
    .notEmpty().withMessage('Los resultados del ordenamiento son obligatorios')
    .isObject().withMessage('assignments debe ser un objeto (cardId → categoryId)'),

  body('customCategories')
    .optional()
    .isArray().withMessage('customCategories debe ser un arreglo'),

  body('customCategories.*.id')
    .optional()
    .notEmpty().withMessage('El id de la categoría es obligatorio'),

  body('customCategories.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio'),

  body('cardOrder')
    .optional()
    .isArray().withMessage('cardOrder debe ser un arreglo'),

  body('comments')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Los comentarios no pueden exceder 500 caracteres'),

  body('difficulty')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('La dificultad debe ser un número entre 1 y 5'),

  handleValidationErrors
];

export const validateParticipationId = [
  param('id')
    .isMongoId().withMessage('ID de participación inválido'),

  handleValidationErrors
];

export const validateListParticipations = [
  param('studyId')
    .isMongoId().withMessage('ID de estudio inválido'),

  query('status')
    .optional()
    .isIn(['started', 'completed', 'abandoned']).withMessage('Estado inválido'),

  handleValidationErrors
];

export const validateStudyResults = [
  param('studyId')
    .isMongoId().withMessage('ID de estudio inválido'),

  handleValidationErrors
];
