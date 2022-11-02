import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),//проверит прийдет или нетБчто не важно .и если прийдетБто урл или нет
]
export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
]
export const updateValidation = [
    body('avatarUrl', 'Неверная ссылка на аватарку').isURL(),
    body('fullName', 'Укажите имя').isLength({min: 3}),

]

export const emailRegExp = /^[\w][\w-.]*@[\w-]+\.[a-z]{2,7}$/i;

export const emailValidator = (email)=> emailRegExp.test(email); // true - valid

export const passwordValidator = (password) => password.length > 7; // true - valid