import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcrypt';

// 스키마 정보 생성
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
    unique: true,
  },
  password: { type: String },
  photoUrl: { type: String },
  displayName: { type: String, unique: true },
  userType: { type: String, enum: ['email', 'github'], default: 'email' },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

// 몽구스 모델 & 컬렉션 생성
const User = mongoose.model('User', userSchema);

export default User;
