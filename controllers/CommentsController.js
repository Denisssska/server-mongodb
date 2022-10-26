import CommentsModel from "../models/Comments.js";

export const create = async (req, res) => {
    try {
        const doc = new CommentsModel({
            comments: req.body.comments,
            user: req.userId,
            postId: req.body.postId,
        })
        const comment = await doc.save()
        res.json(comment)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
};
export const getAllInPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentsModel.find({postId}).populate('user').exec()
        if (!comments) {
            return res.status(404).json({
                message: 'комментарии не найдены'
            })
        }
        res.json(comments)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь комментарии'
        })
    }
}
export const getAll = async (req, res) => {
    try {
        const comments = await CommentsModel.find().populate('user').exec()
        if (!comments) {
            return res.status(404).json({
                message: 'комментарии не найдены'
            })
        }
        res.json(comments)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь комментарии'
        })
    }
}
// text-overflow: ellipsis;

export const getLastComments = async (req, res) => {
    console.log(req.query.item)
    try {
        const item = req.query.item
        const comments = await CommentsModel.find().sort({createdAt:-1}).limit(item).populate('user').exec()
        // const tags = comments.map(obj=>obj.comments).flat().slice(0,2)
        res.json(comments)
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь комментарии'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const commentsId = req.params.id;
        CommentsModel.findByIdAndDelete({
            _id: commentsId
        }, (err, doc) => {
            if (err) {
                res.status(500).json({
                    message: 'Не удалось удалить комментарий'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Комментарий не найден'
                })
            }
            res.json({
                message: 'Комментарий удален'
            })
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось извлечь комментарий'
        })
    }
}
export const update = async (req, res) => {
    try {
        const commentsId = req.params.id;
        await CommentsModel.updateOne({
                _id: commentsId
            },
            {
                comments: req.body.comments,
                postId: req.body.postId,
                user: req.userId
            },
        )
        res.json({
            message: 'комментарий обновлен'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось обновить комментарий'
        })
    }
}