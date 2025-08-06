import { body } from 'express-validator';

export const registerValidation = [
  body('user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('user_password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
  body('user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('user_password')
    .notEmpty()
    .withMessage('Password is required'),
];
