const Card = require('../models/card');
const { ERROR_CODE, errorMessage } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.card.create,
        });
      }

      return res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.body._id)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.card.delete,
        });
      }

      return res.status(200).send({ data: card });
    })
    .catch(() => res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.body._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.card.update,
        });
      }

      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.card.like,
        });
      }

      return res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.body._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE.notFound).send({
          message: errorMessage.notFound.card.update,
        });
      }

      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE.badRequest).send({
          message: errorMessage.badRequest.card.dislike,
        });
      }

      return res.status(ERROR_CODE.serverError).send({ message: errorMessage.serverError });
    });
};
