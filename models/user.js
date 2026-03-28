const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdb')


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);