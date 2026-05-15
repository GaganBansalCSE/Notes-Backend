const { UnauthorizedError } = require('../errors/AppError');
const { verifyAccessToken } = require('../utils/token');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing bearer token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

module.exports = authenticate;
