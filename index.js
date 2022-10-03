import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {loginValidation, registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";
import {authMe, login, registration} from "./controllers/UserController.js";
import * as PostController from './controllers/PostController.js'
import {postsCreateValidation} from "./validations/postsValidation.js";

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.hwtxh3m.mongodb.net/blog?retryWrites=true&w=majority&tls=true')
    .then(
        () => {
            console.log('db connected')
        }
    ).catch((err) => console.log('db error', err));

const app = express()
app.use(cors())
app.use(express.json())

app.post('/auth/register', registerValidation, registration);
app.post('/auth/login', loginValidation, login);
app.get('/auth/me', checkAuth, authMe);

app.post('/posts', checkAuth, postsCreateValidation, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts:id', PostController.remove);
// app.patch('/posts',postController.update);

const PORT = process.env.PORT || 6006
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()
