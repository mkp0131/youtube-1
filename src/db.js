import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on('open', () => {
  console.log(' 😎 DB Connected Complete');
});
db.on('error', (err) => {
  console.log(err);
});
