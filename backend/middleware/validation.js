const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const BadRequestErr = require('../error/BadRequestErr');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new BadRequestErr('Неправильный формат ссылки');
  }
  return value;
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(6),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(6),
  }),
});

const validateUserPatch = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const validationIdUser = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validateURL),
  }),
});

const validationIdCard = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateCard,
  validateUserPatch,
  validationIdUser,
  validationIdCard,
};
