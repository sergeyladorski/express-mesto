const allowedCors = [
  'https://sergeyladorski.nomoredomains.work',
  'http://sergeyladorski.nomoredomains.work/',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE,OPTIONS';

module.exports.corsHandler = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);

    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.status(200).send();
      return;
    }
  }

  next();
};
