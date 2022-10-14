import {body} from 'express-validator'

export const commentsCreateValidation = [
    body("comments", 'Неверный формат поста(укажите массив)').optional().isArray(),
    body("postId", 'Неверный id поста(укажите postId)').isString(),
]
