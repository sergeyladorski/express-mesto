// Ошибки пользователей и карточек
// взяты из таблицы в конце описания проектной работы

module.exports.ERROR_CODE = {
  badRequest: 400,
  notFound: 404,
  serverError: 500,
};

module.exports.errorMessage = {
  badRequest: {
    user: {
      create: 'Переданы некорректные данные при создании пользователя.',
      updateProfile: 'Переданы некорректные данные при обновлении профиля.',
      updateAvatar: 'Переданы некорректные данные при обновлении аватара.',
    },
    card: {
      create: 'Переданы некорректные данные при создании карточки.',
      like: 'Переданы некорректные данные для постановки лайка.',
      dislike: 'Переданы некорректные данные для снятии лайка.',
    },
  },
  notFound: {
    user: {
      find: 'Пользователь по указанному _id не найден.',
      update: 'Пользователь с указанным _id не найден.',
    },
    card: {
      delete: 'Карточка с указанным _id не найдена.',
      update: 'Передан несуществующий _id карточки',
    },
  },
  serverError: 'На сервере произошла ошибка.',
};
