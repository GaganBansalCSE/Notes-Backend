const { prisma } = require('../config/prisma');

const create = (data) => prisma.user.create({ data });
const findByEmail = (email) => prisma.user.findUnique({ where: { email } });
const findById = (id) => prisma.user.findUnique({ where: { id } });

module.exports = { create, findByEmail, findById };
