const { celebrate, Joi } = require('celebrate');

const urlPattern = /^((https?):\/\/(www\.)?([\w\W]{1,})(\.)([a-z]{2,10})([\w\W]{1,})?)$/i;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const userProfileUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userAvatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlPattern),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlPattern),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userIdValidation,
  userProfileUpdateValidation,
  userAvatarUpdateValidation,
  createCardValidation,
  cardIdValidation,
};
