# Проект Место бэкенд

## _Простой способ поделиться фото с друзьями и близкими_

Бэкенд приложения [Mesto](https://sergeyladorski.github.io/react-mesto-auth/)  `В разработке`

Учебный проект от Яндекс.Практикум.
Профессия Веб-разработчик

- Основы бэкенда для фронтенд-разработчиков
- Введение в бэкенд
- Серверная разработка на Node.js
- Введение в Express.js
- Базы данных
- Теория и практика обработки ошибок

## Инструкция по запуску приложения

- Клонировать проект `git clone https://github.com/sergeyladorski/express-mesto.git`;
- Установить зависимости `npm install`;
- Запустить сервер `npm run start`;
- Запустить сервер с hot-reload `npm run dev`.

## Структура проекта

- `app.js` включает основную логику сервера, запуск и подключение к базе данных;
- Директория `models/` содержит файлы описания схем пользователя и карточки;
- Директория `controllers/` содержит файлы описания моделей пользователя и карточки;
- Директория `routes/` содержит описание основных роутов для пользователя и карточки;
- Директория `middlewares/` содержит мидлвэр для авторизации.

## Features

- Настроен editorconfig

- Настроен линтер. Использован eslint, наборы настроек, сделанные на основе стайлгайда Airbnb.
- Добавлено исключение на переменную `_id` в файлах проекта. _Согласно стайлгайду Airbnb, в JavaScript не следует использовать нижние подчёркивания для имён идентификаторов._

- В app.js проект подключен к серверу MongoDB по адресу: `mongodb://localhost:27017/mestodb`.

- Созданы схемы и модели. В проекте две сущности: пользователь и карточки.

  - Поля схемы пользователя:
    - `name` — имя пользователя;
    - `about` — информация о пользователе;
    - `avatar` — ссылка на аватарку;
    - `email` и `password` — почта и пароль, необходимые для регистрации и входа.
  - Поля схемы карточки:
    - `name` — имя карточки;
    - `link` — ссылка на картинку;
    - `owner` — ссылка на модель автора карточки;
    - `likes` — список лайкнувших пост пользователей;
    - `createdAt` — дата создания.

- Контроллеры и роуты для пользователей:

  - `POST /signin` — регистрация нового пользователя;
  - `POST /signup` — авторизация существующего пользователя;
  - `GET /users` — возвращает всех пользователей;
  - `GET /users/me` — возвращает текущего пользователя;
  - `GET /users/:userId` - возвращает пользователя по `_id`;
  - `POST /users` — создаёт пользователя;
  - `PATCH /users/me` — обновляет профиль;
  - `PATCH /users/me/avatar` — обновляет аватар.

- Контроллеры и роуты для карточек:

  - `GET /cards` — возвращает все карточки;
  - `POST /cards` — создаёт карточку;
  - `DELETE /cards/:cardId` — удаляет карточку по идентификатору;
  - `PUT /cards/:cardId/likes` — поставить лайк карточке;
  - `DELETE /cards/:cardId/likes` — убрать лайк с карточки.

- Все роуты, кроме `/signin` и `/signup` , защищены авторизацией;
- Реализована централизованная обработка ошибок;
- Валидация приходящих на сервер запросов;
- Валидация данных на уровне схем.

- Если в любом из запросов что-то идёт не так, сервер возвращает ответ с ошибкой и соответствующим ей
статусом:
    - `400` — переданы некорректные данные в метод создания карточки, пользователя, обновления аватара
пользователя и профиля;
    - `401` — передан неверный логин или пароль. Ещё эту ошибку возвращает авторизационный middleware,
если передан неверный JWT;
    - `403` — попытка удалить чужую карточку;
    - `404` — карточка или пользователь не найден, или был запрошен несуществующий роут;
    - `409` — при регистрации указан email, который уже существует на сервере;
    - `500` — ошибка по умолчанию. Сопровождается сообщением: «На сервере произошла ошибка».



- Обработка запросов на несуществующий роут. После всех роутов описан дополнительный, где все остальные запросы отдают `404` ошибку.


## Tech

В проекте задействованы следующие технологии и ПО:

- Node.js;
- Express.js;
- Mongoose.js;
- ESlint;
- MongoDB;
- Postman;
- Git.

## Планы по доработке проекта:

- Подключить функциональность сайта к бэкэнду;
- Что-то помимо указанного выше, если найду, что еще можно улучшить ;)

Больше моих проектов на [GitHub](https://github.com/sergeyladorski)).

**Sergey Ladorski**
