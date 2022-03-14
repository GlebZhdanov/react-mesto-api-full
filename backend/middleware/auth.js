const jwt = require('jsonwebtoken');
const UnAuthtorizeErr = require('../error/UnAuthtorizeErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthtorizeErr('Ошибка авторизации');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    throw new UnAuthtorizeErr('Ошибка авторизации');
  }

  req.user = payload;

  next();
  return null;
};
