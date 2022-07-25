import mongoose, { Schema } from "mongoose";
import Reply from "./reply";


const CommentSchema = new Schema({
  postId: { type: mongoose.Types.ObjectId, required: true },
  author: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      userId: { type: String, required: true },
      nickname: { type: String, required: true }
    }, required: true
  },
  content: { type: String, required: true },
  // reply: { type: Number, default: 0 },
  // reply: { type: [mongoose.Types.ObjectId], default: [], ref: Reply },
  reply: { type: [Object], default: [] },
  like: { type: [Object], default: [] },
  publishedDate: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;