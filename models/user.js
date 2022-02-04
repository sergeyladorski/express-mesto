const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isURL(v)) {
        throw new Error('Некорректная ссылка.');
      }
    },
  },
});

module.exports = mongoose.model('user', userSchema);
