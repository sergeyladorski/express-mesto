/* eslint-disable no-shadow */
const Card = require('../models/card');
const { errorMessage } = require('../utils/errors');
const NotFoundError = require('../middlewares/errors/not-found-error');
const BadRequestError = require('../middlewares/errors/bad-request-error');
const ForbiddenError = require('../middlewares/errors/forbidden-error');

// get all existing cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

// create card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessage.badRequest.card.create);
      }
    })
    .catch(next);
};

// delete card
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessage.notFound.card.delete);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(errorMessage.forbidden.card.delete);
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch(next);
};

// set card like
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessage.notFound.card.update);
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError(errorMessage.notFound.card.update);
      } if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessage.badRequest.card.like);
      }
    })
    .catch(next);
};

// remove card like
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessage.notFound.card.update);
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError(errorMessage.notFound.card.update);
      } if (err.name === 'ValidationError') {
        throw new BadRequestError(errorMessage.badRequest.card.dislike);
      }
    })
    .catch(next);
};
