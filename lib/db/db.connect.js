const mongoose = require('mongoose');

const { DB_CONNECTION_STRING } = require('../../config');

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
