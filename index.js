import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {loginValidation, registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";

import {postsCreateValidation} from "./validations/postsValidation.js";
import multer from 'multer'
import handleValidationErrors from "./utils/handleValidationErrors.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})
// mongodb+srv://admin:wwwwww@cluster0.hwtxh3m.mongodb.net/blog?retryWrites=true&w=majority&tls=true
mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log('db connected')
        }
    ).catch((err) => console.log('db error', err));

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))//чтобы можно было открыть картинку в урле

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.registration);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.authMe);

app.post('/posts', checkAuth, postsCreateValidation, handleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postsCreateValidation, handleValidationErrors, PostController.update);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);

const PORT = process.env.PORT || 6006
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()
