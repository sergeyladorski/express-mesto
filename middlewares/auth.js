/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnauthoriedError = require('./errors/unauthorized-error');
const { errorMessage } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new UnauthoriedError(errorMessage.authorization.unauthorized);
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  next();
};
