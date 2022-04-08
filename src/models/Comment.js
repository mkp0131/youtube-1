import mongoose from 'mongoose';
const { Schema } = mongoose;

// 스키마 정보 생성
const commentSchema = new Schema({
  comment: { type: String, required: true, trim: true, maxLength: 200 },
  createdAt: { type: Date, required: true, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
});

// 몽구스 모델 & 컬렉션 생성
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
