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
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessage.notFound.user.find);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessage.notFound.user.find));
      } else {
        next(err);
      }
    });
};
// get current user
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessage.notFound.user.find);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(errorMessage.notFound.user.find));
      } else {
        next(err);
      }
    });
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
    .then(() => res.status(201).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorMessage.conflict.user.notUnique));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessage.badRequest.user.create));
      } else {
        next(err);
      }
    });
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

  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessage.notFound.user.find);
    })
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        {
          new: true,
          runValidators: true,
        },
      )
        .then((user) => {
          res.status(200).send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(errorMessage.badRequest.user.updateProfile));
          } if (err.name === 'CastError') {
            next(new NotFoundError(errorMessage.notFound.user.update));
          } else {
            next(err);
          }
        });
    });
};

// update user avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(errorMessage.notFound.user.find);
    })
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        {
          new: true,
          runValidators: true,
        },
      )
        .then((user) => {
          res.status(200).send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(errorMessage.badRequest.user.updateAvatar));
          } if (err.name === 'CastError') {
            next(new NotFoundError(errorMessage.notFound.user.update));
          } else {
            next(err);
          }
        });
    });
};
