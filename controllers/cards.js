const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  // STATUS_UNAUTHORIZED,
  // STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  // STATUS_INTERNAL_SERVER_ERROR,
  STATUS_FORBIDDEN,
  // STATUS_CONFLICT,
  // STATUS_INTERNAL_SERVER_ERROR,
} = require('../constants/http-status');
const NotFoundError = require('../errors/not-found-error');

function getAllCards(req, res, next) {
  return Card.find()
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
    .catch(next);
}

function createCard(req, res, next) {
  return Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((dataFromDB) => res.status(STATUS_CREATED)
      .send({
        name: dataFromDB.name,
        link: dataFromDB.link,
        _id: dataFromDB._id,
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      return next(err);
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
    // .send({ name: dataFromDB.name, about: dataFromDB.name }))
    // у фотки поля с описанием называется name. + есть лайки, ссылка, владелец, дата
    .catch((err) => {
      if (err.message === 'Not found') return res.status(STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      return next(err);
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
    // .send({ name: dataFromDB.name, about: dataFromDB.about }))
    // у фотки поля с описанием называется name.
    // и еще есть лайки, ссылка, владелец, дата
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      if (err.message === 'Not found') return res.status(STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      return next(err);
    });
}

async function findCardById(cardId) {
  try { // console.log('В ПОИСКОВИК ПРИШЛА CARD ID) ', cardId);
    const cardData = await Card.findById(cardId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена')); // 🟡 Не уверен что тут нужно orFail
    // console.log('ИЩЕЙКА ВЕРНЕТ CARD DATA: ', cardData);
    return cardData;
  } catch (err) { // не знаю нужен ли ерр в аргументе
    return new NotFoundError('Карточка с указанным _id не найдена'); // 🟡 Не уверен что тут нужен catch при наличии чуть выше orFail
  }
}

// console.log('В удаляшку подаю запрос с параметрами req.params: ', req.params);
// console.log('В параметрах запроса к удаляшке есть айдишка карточки: ', req.params.cardId);
function deleteCard(req, res, next) {
  // Проверяю наличие user._id в запросе зря - роут защищен мидлвэрой.
  // if (!req.user._id) return res.status(STATUS_BAD_REQUEST)
  //  .send({ message: 'Переданы некорректные данные' }); // текст не из таблицы
  // проверяю матч айдишки из запроса и айдишки из инфы о владельце карточки
  return findCardById(req.params.cardId)
    .then((foundCardData) => {
      // console.log('ИЗ ИЩЕЙКИ В ОБРАБОТЧИК ПРИШЛА КАРТОЧКА С ВЛАДЕЛЬЦЕМ', foundCardData.owner);
      // проверяю матч айдишки из запроса и айдишки из инфы о владельце карточки
      if (!foundCardData.owner.equals(req.user._id)) return res.status(STATUS_FORBIDDEN).send({ message: 'Попытка удалить чужую карточку' });
      // console.log('ПОСЛЕ ВСЕХ ПРОВЕРОК БУДЕТ ЗАПУЩЕН КОД УДАЛЕНИЯ КАРТОЧКИ');
      return Card.findByIdAndDelete(req.params.cardId)
        .orFail(new NotFoundError('Карточка с указанным _id не найдена')) // наверное лишний орфейл - есть у колбэка
        .then((dataFromDB) => res.status(STATUS_OK).send({ _id: dataFromDB._id }));
    })
    .catch((err) => {
      // console.log('СРАБОТАЛ catch УДАЛЕНИЯ КАРТОЧКИ');
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'Not found') res.status(STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      // console.log('НЕ СРАБОТАЛИ КАСТ ЭРРОР, ВАЛИДЕЙШН, НОТФАУНТ. КИДАЮ ДЕФОЛТ');
      return next(err);
    });
}

module.exports = {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
