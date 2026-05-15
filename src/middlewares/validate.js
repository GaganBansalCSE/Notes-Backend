const { ZodError } = require('zod');
const { BadRequestError } = require('../errors/AppError');
const { sanitizeValue } = require('../utils/sanitize');

const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const parsed = schema.parse(sanitizeValue(req[source]));
    req[source] = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new BadRequestError('Validation failed', error.issues));
    }
    return next(error);
  }
};

module.exports = validate;
