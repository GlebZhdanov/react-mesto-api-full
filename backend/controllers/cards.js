const Card = require('../models/card');
const BadRequestErr = require('../error/BadRequestErr');
const NotFoundErr = require('../error/NotFoundErr');
const ForbiddenErr = require('../error/ForbiddenErr');

exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.status(200).send(card);
  } catch (err) {
    next(err);
  }
};

exports.postCards = async (req, res, next) => {
  try {
    const {
      name, link,
    } = req.body;
    const owner = req.user._id;
    const card = new Card({
      name, link, owner,
    });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

exports.deleteCard = async (req, res, next) => {
  const cardId = req.params.id;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundErr('Карточка не найденна');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Удалять можно только свои карточки');
      }
      return card.remove()
        .then(() => {
          res.send({ message: 'Карточка удаленна' });
        });
    })
    .catch(next);
};

exports.putCardLike = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const likeCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (likeCard) {
      res.status(200).send(likeCard);
    } else {
      throw new NotFoundErr('Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Ошибка валидации id'));
    } else {
      next(err);
    }
  }
};

exports.deleteCardLike = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const dislikeCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (dislikeCard) {
      res.status(200).send(dislikeCard);
    } else {
      throw new NotFoundErr('Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Ошибка валидации id'));
    } else {
      next(err);
    }
  }
};
