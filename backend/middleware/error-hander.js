const errorHandler = (err, req, res, next) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка сервера';
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
