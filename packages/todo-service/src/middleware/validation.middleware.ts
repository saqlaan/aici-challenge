import { body, param } from 'express-validator';

export const createTodoValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
];

export const updateTodoValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid todo ID'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
];

export const todoIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid todo ID'),
];
