import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/ytjs');

const db = mongoose.connection;

db.on('open', () => {
  console.log(' 😎 DB Connected Complete');
});
db.on('error', (err) => {
  console.log(err);
});
