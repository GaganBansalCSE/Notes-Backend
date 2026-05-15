require('dotenv').config();

const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Server started');
});

const shutdown = (signal) => {
  logger.info({ signal }, 'Graceful shutdown initiated');
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
