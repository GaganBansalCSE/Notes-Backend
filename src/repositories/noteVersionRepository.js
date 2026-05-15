const { prisma } = require('../config/prisma');

const create = (data) => prisma.noteVersion.create({ data });
const listByNoteId = (noteId) =>
  prisma.noteVersion.findMany({ where: { noteId }, orderBy: { createdAt: 'desc' }, include: { editor: true } });
const findById = (id) => prisma.noteVersion.findUnique({ where: { id } });

module.exports = { create, listByNoteId, findById };
