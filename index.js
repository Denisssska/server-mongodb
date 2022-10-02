import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import {validationResult} from 'express-validator';
import UserModel from './models/user.js'

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.hwtxh3m.mongodb.net/blog?retryWrites=true&w=majority&tls=true')
    .then(
        () => {
            console.log('db ok! db ok')
        }
    ).catch((err) => console.log('db error', err));

const app = express()
app.use(cors())
app.use(express.json())


app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        //прячем пороль
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })
        const user = await doc.save();
        const {passwordHash, ...userData} = user._doc
        const token = jwt.sign({
                _id: user._id
            },
            'secretKey123',
            {
                expiresIn: '30d',//сколько будет жить токен
            }
        );
        res.json({...userData, token})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
});
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
                message: 'пользователь не найден'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(403).json({
                message: 'неверный логин или пароль'
            })
        }
        const token = jwt.sign({
                _id: user._id
            },
            'secretKey123',
            {
                expiresIn: '30d',//сколько будет жить токен
            }
        );
        const {passwordHash, ...userData} = user._doc;
        res.json({...userData, token})

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
})
const PORT = process.env.PORT || 6006
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()
