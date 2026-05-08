import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../routes/errorMiddleware/validationMiddleware.mjs';

export const validateCreateStudy = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres'),

  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),

  body('type')
    .optional()
    .isIn(['open', 'closed', 'hybrid']).withMessage('Tipo de estudio inválido'),

  body('cards')
    .isArray({ min: 2 }).withMessage('Debe haber al menos 2 tarjetas'),

  body('cards.*.id')
    .notEmpty().withMessage('El id de la tarjeta es obligatorio'),

  body('cards.*.text')
    .trim()
    .notEmpty().withMessage('El texto de la tarjeta es obligatorio'),

  body('cards.*.description')
    .optional()
    .trim(),

  body('predefinedCategories')
    .optional()
    .isArray().withMessage('Las categorías predefinidas deben ser un arreglo'),

  body('predefinedCategories.*.id')
    .optional()
    .notEmpty().withMessage('El id de la categoría es obligatorio'),

  body('predefinedCategories.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio'),

  body('settings.maxCardsPerCategory')
    .optional()
    .isInt({ min: 1 }).withMessage('maxCardsPerCategory debe ser un número positivo'),

  body('settings.minCardsPerCategory')
    .optional()
    .isInt({ min: 0 }).withMessage('minCardsPerCategory debe ser un número no negativo'),

  body('settings.allowUncategorized')
    .optional()
    .isBoolean().withMessage('allowUncategorized debe ser true o false'),

  body('settings.timeLimit')
    .optional()
    .isInt({ min: 1 }).withMessage('timeLimit debe ser un número positivo (minutos)'),

  body('settings.shuffleCards')
    .optional()
    .isBoolean().withMessage('shuffleCards debe ser true o false'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Fecha de inicio inválida'),

  body('endDate')
    .optional()
    .isISO8601().withMessage('Fecha de fin inválida'),

  handleValidationErrors
];

export const validateUpdateStudy = [
  param('id')
    .isMongoId().withMessage('ID de estudio inválido'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('La descripción no puede estar vacía')
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),

  body('type')
    .optional()
    .isIn(['open', 'closed', 'hybrid']).withMessage('Tipo de estudio inválido'),

  body('cards')
    .optional()
    .isArray({ min: 2 }).withMessage('Debe haber al menos 2 tarjetas'),

  body('cards.*.id')
    .notEmpty().withMessage('El id de la tarjeta es obligatorio'),

  body('cards.*.text')
    .trim()
    .notEmpty().withMessage('El texto de la tarjeta es obligatorio'),

  body('predefinedCategories')
    .optional()
    .isArray().withMessage('Las categorías predefinidas deben ser un arreglo'),

  body('settings.maxCardsPerCategory')
    .optional()
    .isInt({ min: 1 }).withMessage('maxCardsPerCategory debe ser un número positivo'),

  body('settings.minCardsPerCategory')
    .optional()
    .isInt({ min: 0 }).withMessage('minCardsPerCategory debe ser un número no negativo'),

  body('settings.allowUncategorized')
    .optional()
    .isBoolean().withMessage('allowUncategorized debe ser true o false'),

  body('settings.timeLimit')
    .optional()
    .isInt({ min: 1 }).withMessage('timeLimit debe ser un número positivo (minutos)'),

  body('settings.shuffleCards')
    .optional()
    .isBoolean().withMessage('shuffleCards debe ser true o false'),

  handleValidationErrors
];

export const validateStudyId = [
  param('id')
    .isMongoId().withMessage('ID de estudio inválido'),

  handleValidationErrors
];

export const validatePublicLink = [
  param('link')
    .trim()
    .notEmpty().withMessage('El link es obligatorio'),

  handleValidationErrors
];

export const validateListStudies = [
  query('status')
    .optional()
    .isIn(['draft', 'published', 'closed', 'archived']).withMessage('Estado inválido'),

  query('type')
    .optional()
    .isIn(['open', 'closed', 'hybrid']).withMessage('Tipo de estudio inválido'),

  handleValidationErrors
];
