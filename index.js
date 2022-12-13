import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {loginValidation, registerValidation, updateValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";
import {postsCreateValidation} from "./validations/postsValidation.js";
import multer from 'multer'
import handleValidationErrors from "./utils/handleValidationErrors.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentsController from "./controllers/CommentsController.js";
import * as fs from "fs";
import {commentsCreateValidation} from "./validations/CommentsValidation.js";
import {LOCAL_PORT, MongoDBDen} from "./utils/config.js";


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        // if (!fs.existsSync('uploads')) {
        //     fs.mkdirSync('uploads')    //если нет папки аплоадс то создаем ее
        // }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})
// 'mongodb+srv://admin:wwwwww@cluster0.hwtxh3m.mongodb.net/blog?retryWrites=true&w=majority&tls=true'
mongoose.connect(process.env.MONGODB_URI || MongoDBDen)
    .then(
        () => {
            console.log('db connected')
        }
    ).catch((err) => console.log('db error', err));

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        // if(whitelist.includes(origin || ""))
        //     return callback(null, true)
        //
        // callback(new Error('Not allowed by CORS'));
        console.log("origin: ", origin);
        callback(null, true); // everyone is allowed
    }
};
const app = express()

app.use(cors(corsOptions))
app.use(allowCrossDomain)

app.use(express.json())
app.use('/uploads', express.static('uploads'))//чтобы можно было открыть картинку в урле

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.post('/update', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.registration);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.authMe);
app.patch('/auth/:id', checkAuth, updateValidation, UserController.updateUser);
app.post("/auth/send-password-link", UserController.sendMail)
app.get("/auth/create-new-password/:id/:token", UserController.createNewPassword)

app.post('/posts', checkAuth, postsCreateValidation, handleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postsCreateValidation, handleValidationErrors, PostController.update);

app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.get('/posts/popular/:limit', checkAuth, postsCreateValidation, PostController.getAllPostByViews);

app.get('/posts', PostController.getSortPosts);

app.post('/comments', checkAuth, commentsCreateValidation, handleValidationErrors, CommentsController.create);
app.get('/comments', CommentsController.getLastComments)
app.get('/comments/:id', CommentsController.getAllInPost)
app.get('/comments', CommentsController.getAll)
app.delete('/comments/:id', checkAuth, CommentsController.remove);
app.patch('/comments/:id', checkAuth, commentsCreateValidation, handleValidationErrors, CommentsController.update);


const PORT = process.env.PORT || LOCAL_PORT
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log({...e})
    }
}
start()
