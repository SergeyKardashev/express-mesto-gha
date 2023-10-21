const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
