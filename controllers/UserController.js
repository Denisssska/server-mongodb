import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import {transporter} from "../utils/GmailController.js";

export const createNewPassword = async (req, res) => {
    const {id, token} = req.params
    const password = req.query.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    try {
        const validUser = await UserModel.findOne({_id: id, verifyToken: token})
        //console.log(validUser)
        const verifyToken = jwt.verify(token, 'secretKey123')
        if (validUser && verifyToken) {
            await UserModel.updateOne({_id: id}, {passwordHash: hash})
             res.status(201).json({status:201,message:"password changed successfully"})
        } else {
            res.status(401).json({status: 401, message: "user is not exists"})
        }
    } catch (e) {
        res.status(401).json({status: 401, message: e})
    }

}

export const sendMail = async (req, res) => {
    const {email, message} = req.body;
    if (!email) {
        res.status(401).json({status: 401, message: "Enter Your Email"})
    }
    try {
        const userFind = await UserModel.findOne({email})
        const token = jwt.sign({
                _id: userFind._id
            },
            'secretKey123',
            {
                expiresIn: '30d',//сколько будет жить токен
            }
        );
        const setUserToken = await UserModel.findByIdAndUpdate({_id: userFind._id}, {verifyToken: token}, {new: true})
        if (setUserToken) {
            const mailOptions = {
                from: email,
                to: email,
                subject: "Sending Email For password Reset",
                //http://localhost:3000/create-password
                text: `http://localhost:3000/create-password/${userFind._id}/${setUserToken.verifyToken}`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error)
                    res.status(401).json({status: 401, message: "email not send"})
                } else {
                    console.log("Email sent", info.response)
                    res.status(201).json({status: 201, message: "Email sent successfully"})
                }
            })
        }
        // res.json({...userData, token})
    } catch (e) {
        res.status(401).json({status: 401, message: "invalid user"})
    }
};

export const registration = async (req, res) => {
    try {
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
};
export const login = async (req, res) => {
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
};
export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc;
        res.json(userData)
    } catch (e) {
        res.status(500).json({
            message: 'Не доступа'
        })
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await UserModel.updateOne({
                _id: userId
            },
            {
                avatarUrl: req.body.avatarUrl,
                fullName: req.body.fullName,
            },
        )
        res.json({
            message: 'фото обновлено'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось обновить фото'
        })
    }
}