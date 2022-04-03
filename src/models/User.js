import mongoose from 'mongoose';
const { Schema } = mongoose;

// 스키마 정보 생성
const userSchema = new Schema({
  email: { type: String, required: true, trim: true, maxLength: 30 },
  password: { type: String, required: true },
  photoUrl: { type: String },
  displayName: { type: String },
  userType: { type: String, enum: ['email', 'github'], default: 'email' },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

// 몽구스 모델 & 컬렉션 생성
const User = mongoose.model('User', userSchema);

export default User;
