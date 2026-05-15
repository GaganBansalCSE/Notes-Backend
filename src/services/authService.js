const bcrypt = require('bcryptjs');
const ms = require('ms');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const { ConflictError, UnauthorizedError } = require('../errors/AppError');
const { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token');

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const { token: refreshToken, jti } = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_TTL));

  await refreshTokenRepository.create({
    userId: user.id,
    jti,
    tokenHash: hashToken(refreshToken),
    expiresAt
  });

  return { accessToken, refreshToken };
};

const register = async ({ email, password, name }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await userRepository.create({ email, passwordHash, name });

  const tokens = await issueTokens(user);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = await issueTokens(user);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  };
};

const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const persistedToken = await refreshTokenRepository.findActiveByJti(payload.jti);
  if (!persistedToken || persistedToken.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token revoked or expired');
  }

  if (persistedToken.tokenHash !== hashToken(refreshToken)) {
    throw new UnauthorizedError('Refresh token mismatch');
  }

  await refreshTokenRepository.revokeById(persistedToken.id);

  const tokens = await issueTokens(persistedToken.user);

  return {
    user: {
      id: persistedToken.user.id,
      email: persistedToken.user.email,
      name: persistedToken.user.name
    },
    ...tokens
  };
};

const logout = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  const persistedToken = await refreshTokenRepository.findActiveByJti(payload.jti);
  if (persistedToken) {
    await refreshTokenRepository.revokeById(persistedToken.id);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
