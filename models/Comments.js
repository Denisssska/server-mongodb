import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({

    comments: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

export default mongoose.model("Comments", CommentsSchema)