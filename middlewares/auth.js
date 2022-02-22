/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { errorMessage } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: errorMessage.authorization.unauthorized });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
