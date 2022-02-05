const User = require('../models/user');
const { ERROR_CODE, errorMessage } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.findAll,
        });
        return;
      }
      res.status(200).send({ data: users });
    })
    .catch(() => res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.update,
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.find,
        });
      }
      return res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.user.create,
        });
      }
      return res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};

module.exports.updateProfile = (req, res) => {
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
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.update,
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.user.updateProfile,
        });
        return;
      } if (err.name === 'CastError') {
        res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.update,
        });
        return;
      }
      res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};

module.exports.updateAvatar = (req, res) => {
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
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.update,
        });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.user.updateAvatar,
        });
        return;
      } if (err.name === 'CastError') {
        res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.user.update,
        });
        return;
      }
      res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};
