const jwt = require('jsonwebtoken');
const UnAuthtorizeErr = require('../error/UnAuthtorizeErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthtorizeErr('Ошибка авторизации');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (err) {
    throw new UnAuthtorizeErr('Ошибка авторизации');
  }

  req.user = payload;

  next();
  return null;
};
