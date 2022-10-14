import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    comments:{
        type:Array,
        default:[]
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
    // post:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post',
    //     required: true
    // }
}, {
    timestamps: true,
})

export default mongoose.model("Comments", CommentsSchema)