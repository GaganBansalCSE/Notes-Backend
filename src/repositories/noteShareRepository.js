const { prisma } = require('../config/prisma');

const create = (data) => prisma.noteShare.create({ data });
const findExisting = (noteId, sharedWithId) => prisma.noteShare.findUnique({ where: { noteId_sharedWithId: { noteId, sharedWithId } } });

module.exports = { create, findExisting };
