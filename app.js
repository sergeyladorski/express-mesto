const express = require('express');
const mongoose = require('mongoose');
const { ERROR_CODE, errorMessage } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '61fce9203ab23dfd71d81fb0',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_CODE.notFound).send({ message: errorMessage.notFound.page });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
