const Card = require('../models/card');
const {
  notFound,
  badRequest,
  ok,
  created,
  InternalServerError,
} = require('../constants/errorCodes');

// tmp middleware добавляет объект user в запросы. req.user._id

function getAllCards(req, res) {
  Card.find()
    .then((dataFromDB) => res.status(ok).send(dataFromDB))
    .catch(() => res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' }));
}

function createCard(req, res) {
  return Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((dataFromDB) => res.status(created)
      .send({
        name: dataFromDB.name,
        link: dataFromDB.link,
        _id: dataFromDB._id,
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok).send({ name: dataFromDB.name, about: dataFromDB.about }))

    .catch((err) => {
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok).send({ name: dataFromDB.name, about: dataFromDB.about }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

// 🟡  трай энд кэтч добавил
async function findCardById(cardId) {
  try {
    console.log('В ПОИСКОВИК ПРИШЛА CARD ID) ', cardId);

    const cardData = await Card.findById(cardId).orFail(new Error('Not found 1')); // 🟡 Не уверен что тут нужно orFail

    console.log('ИЩЕЙКА ВЕРНЕТ CARD DATA: ', cardData);

    return cardData;
  } catch (err) {
    // не знаю нужен ли ерр в аргументе

    return new Error('Not found 2'); // 🟡 Не уверен что тут нужен catch при наличии чуть выше orFail
  }
}

function deleteCard(req, res) {
  // 🟡 Проверяю наличие айдишки в запросе, может зря - этот роут защищен мидлвэрой.
  // console.log('В удаляшку подаю запрос с параметрами req.params: ', req.params);
  console.log('В параметрах запроса к удаляшке есть айдишка карточки: ', req.params.cardId);
  if (!req.user._id) return res.status(badRequest).send({ message: '🟡 ХЗ КТО УДАЛЯЕТ. В ТОКЕНЕ НЕТ ID' });

  // проверяю матч айдишки из запроса и айдишки из инфы о владельце карточки

  return findCardById(req.params.cardId)
    .then((foundCardData) => {
      console.log('ИЗ ИЩЕЙКИ В ОБРАБОТЧИК ПРИШЛА КАРТОЧКА С ВЛАДЕЛЬЦЕМ', foundCardData.owner);

      // проверяю матч айдишки из запроса и айдишки из инфы о владельце карточки
      // 🟡 КОД ОШИБКИ НЕ ТОТ
      if (!foundCardData.owner.equals(req.user._id)) return res.status(500).send({ message: '🟡 СРАВНИЛ НЕЕЕЕ УСПЕШНО' });

      console.log('ПОСЛЕ ВСЕХ ПРОВЕРОК БУДЕТ ЗАПУЩЕН КОД УДАЛЕНИЯ КАРТОЧКИ');

      return Card.findByIdAndDelete(req.params.cardId)
        .orFail(new Error('Not found'))
        .then((dataFromDB) => res.status(ok).send({ _id: dataFromDB._id }));
    })
    .catch((err) => {
      console.log('СРАБОТАЛ catch УДАЛЕНИЯ КАРТОЧКИ');

      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'Not found') res.status(notFound).send({ message: 'Карточка с указанным _id не найдена' });

      console.log('НЕ СРАБОТАЛИ КАСТ ЭРРОР, ВАЛИДЕЙШН, НОТФАУНТ. КИДАЮ ДЕФОЛТ');
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

module.exports = {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
