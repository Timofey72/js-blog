import { body } from 'express-validator'

export const postCreateValidation = [
  body('title', 'Заголовок должен быть минимум 5 символов').isLength({ min: 5 }),
  body('text', 'Текст должен быть минимум 16 символов').isLength({ min: 16 }),
  body('tags', 'Неверный формат тегов. Укажите массив').optional().isArray(),
  body('imageUrl', 'Некорректная ссылка на изображение').optional().isURL(),
]
