import {body} from 'express-validator'

export const postsCreateValidation = [
    body('title', ' Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
    body("tags", 'Неверный формат тэгов(укажите массив)').optional(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
