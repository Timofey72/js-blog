import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Некорректно указан email').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 }),
];

export const registerValidation = [
  body('email', 'Некорректно указан email').isEmail(),
  body('name', 'Укажите имя').isLength({ min: 3 }),
  body('surname', 'Укажите фамилию').isLength({ min: 3 }),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 }),
  body('avatar_url', 'Некорректная ссылка на аватарку').optional().isURL(),
];
