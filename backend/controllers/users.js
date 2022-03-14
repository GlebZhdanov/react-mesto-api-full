const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundErr = require('../error/NotFoundErr');
const BadRequestErr = require('../error/BadRequestErr');
const ConflictError = require('../error/ConflictError');
const UnAuthorizeErr = require('../error/UnAuthtorizeErr');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundErr('Пользователь с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Ошибка валидации id'));
    } else {
      next(err);
    }
  }
};

module.exports.getUsersById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundErr('Пользователь с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Ошибка валидации id'));
    } else {
      next(err);
    }
  }
};

module.exports.patchUsers = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      throw new BadRequestErr('Поля "name" и "about" должно быть заполнены');
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundErr('Пользователь с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'VaidationError') {
      next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

module.exports.patchUsersAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      throw new BadRequestErr('Поля "avatar" должно быть заполнены');
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundErr('Пользователь с указанным id не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestErr('Не верный email или пароль');
  }

  bcrypt.hash(password, SOLT_ROUND)
    .then((user) => User.create({
      name,
      about,
      avatar,
      email,
      password: user,
    }))
    .then(() => res.status(201).send({
      data: {
        about, name, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new UnAuthorizeErr('Не верный email или пароль'))
    .then((admin) => {
      if (!admin) {
        throw new UnAuthorizeErr('Не верный email или пароль');
      }
      return bcrypt.compare(password, admin.password)
        .then((matches) => {
          if (!matches) {
            throw new UnAuthorizeErr('Не верный email или пароль');
          }
          const token = jwt.sign(
            { _id: admin._id },
            'secret',
            { expiresIn: '7d' },
          );
          res.send({ message: `Bearer ${token}` });
        });
    })
    .catch((err) => next(err));
};
