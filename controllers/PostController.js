import PostModel from "../models/Post.js";


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
};
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь статьи'
        })
    }
}
// text-overflow: ellipsis;

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts.map(obj=>obj.tags).flat().slice(0,5)
        res.json(tags)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь теги'
        })
    }
}
export const getAllPostByViews = async (req, res) => {
    try {
        const limit =  req.params.limit
        const posts = await PostModel.find().populate('user').limit(limit).exec()

        res.json(posts)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь теги'
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: {viewsCount: 1}
        }, {
            returnDocument: 'after'
        }, (err, doc) => {
            if (err) {
                return res.status(500).json({
                    message: 'Не удалось вернуть статью'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }
            res.json(doc)
        }).populate('user')
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь статьи'
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }
            res.json({
                message: 'Статья удалена'
            })
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь статьи'
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                commentsCount:req.body.commentsCount,
                user: req.userId
            },
        )
        res.json({
            message: 'статья обновлена'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}