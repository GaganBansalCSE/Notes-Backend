const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    }
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(express.json({ limit: env.MAX_BODY_SIZE }));
app.use(express.urlencoded({ extended: false, limit: env.MAX_BODY_SIZE }));
app.use(pinoHttp({ logger }));

app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
