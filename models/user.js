const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [30, 'Максимум более 30 символов'],
    required: [true, 'Поле должно быть заполнено'],
  },
  about: {
    type: String,
    minlength: [2, 'Минимум 2 символа'],
    maxlength: [30, 'Максимум более 30 символов'],
    required: [true, 'Поле должно быть заполнено'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
});

module.exports = mongoose.model('user', userSchema);
