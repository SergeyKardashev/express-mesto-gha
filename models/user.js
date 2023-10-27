const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
      },
    },
    password: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Минимум 2 символа'],
      maxlength: [30, 'Максимум более 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимум 2 символа'],
      maxlength: [30, 'Максимум более 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
