const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  gender: String,
  customGender: String,
  profession: String,
  companyName: String,
  designation: String,
  dob: Date,
  country: String,
  address: String,
  profilePic: String,
  currentPassword: String,
  newPassword: String,
});

module.exports = mongoose.model('User', userSchema);
