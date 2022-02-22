const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorMessage } = require('../utils/errors');
const NotFoundError = require('../middlewares/errors/not-found-error');
const BadRequestError = require('../middlewares/errors/bad-request-error');
const UnauthorizedError = require('../middlewares/errors/unauthorized-error');
const ConflictError = require('../middlewares/errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// get all existing users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};
// get user by id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(errorMessage.notFound.user.find);
      }
    })
    .catch(next);
};
// get current user
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError(errorMessage.notFound.user.find);
      }
    })
    .catch(next);
};
// create user
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(errorMessage.badRequest.user.create);
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(errorMessage.conflict.user.notUnique);
      }
    })
    .catch(next);
};
// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError(errorMessage.authorization.failed);
    })
    .catch(next);
};
// update user name & user about
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessage.badRequest.user.updateProfile);
      } if (err.name === 'CastError') {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
    })
    .catch(next);
};

// update user avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessage.badRequest.user.updateAvatar);
      } if (err.name === 'CastError') {
        throw new NotFoundError(errorMessage.notFound.user.update);
      }
    })
    .catch(next);
};
