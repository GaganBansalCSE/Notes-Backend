const { prisma } = require('../config/prisma');

const create = (data) => prisma.refreshToken.create({ data });
const findActiveByJti = (jti) =>
  prisma.refreshToken.findFirst({ where: { jti, revokedAt: null }, include: { user: true } });
const revokeById = (id) => prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });

module.exports = { create, findActiveByJti, revokeById };
