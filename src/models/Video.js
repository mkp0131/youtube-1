import mongoose from 'mongoose';
const { Schema } = mongoose;

// 스키마 정보 생성
const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

videoSchema.static('formatHashtags', (hashtags) => {
  // return hashtags.
  return hashtags
    .split(',')
    .map((word) => (word.startsWith('#') ? word : '#' + word));
});

// 몽구스 모델 & 컬렉션 생성
const Video = mongoose.model('Video', videoSchema);

export default Video;
