import mongoose from 'mongoose';
const { Schema } = mongoose;

// 스키마 정보 생성
const videoSchema = new Schema({
  videoUrl: { type: String, required: true },
  thumnailUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxLength: 10 },
  description: { type: String, required: true, maxLength: 100 },
  createdAt: { type: Date, required: true, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

videoSchema.static('formatHashtags', (hashtags) => {
  // return hashtags.
  return hashtags
    .split(',')
    .map((word) => (word.startsWith('#') ? word : '#' + word.trim()));
});

// 몽구스 모델 & 컬렉션 생성
const Video = mongoose.model('Video', videoSchema);

export default Video;
