const { AppError } = require('../errors/AppError');
const logger = require('../config/logger');

module.exports = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details
    });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' });
};
