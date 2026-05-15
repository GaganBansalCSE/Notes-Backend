const { prisma } = require('../config/prisma');
const noteRepository = require('../repositories/noteRepository');
const noteShareRepository = require('../repositories/noteShareRepository');
const noteVersionRepository = require('../repositories/noteVersionRepository');
const userRepository = require('../repositories/userRepository');
const { BadRequestError, ConflictError, ForbiddenError, NotFoundError } = require('../errors/AppError');
const { parsePagination } = require('../utils/pagination');

const assertOwner = (note, userId) => {
  if (!note || note.ownerId !== userId) {
    throw new ForbiddenError('Only note owner can perform this action');
  }
};

const listNotes = async (userId, query) => {
  const pagination = parsePagination(query);
  const ownedOnly = query.ownedOnly === true;

  const [items, total] = await Promise.all([
    noteRepository.listAccessible({ userId, ...pagination, ownedOnly }),
    noteRepository.countAccessible({ userId, ownedOnly })
  ]);

  return {
    items,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit) || 1
    }
  };
};

const getNote = async (id, userId) => {
  const note = await noteRepository.findAccessibleById(id, userId);
  if (!note) {
    throw new NotFoundError('Note not found');
  }
  return note;
};

const createNote = async (data, userId) => noteRepository.create({ ...data, ownerId: userId });

const updateNote = async (id, data, userId) => {
  const existing = await noteRepository.findAccessibleById(id, userId);
  if (!existing) {
    throw new NotFoundError('Note not found');
  }

  assertOwner(existing, userId);

  await prisma.$transaction(async (tx) => {
    await tx.noteVersion.create({
      data: {
        noteId: existing.id,
        title: existing.title,
        content: existing.content,
        editorId: userId,
        noteVersion: existing.version
      }
    });

    const updated = await tx.note.updateMany({
      where: { id, version: data.version, deletedAt: null },
      data: { title: data.title, content: data.content, version: { increment: 1 } }
    });

    if (updated.count === 0) {
      throw new ConflictError('Note update conflict. Please refresh and retry.');
    }
  });

  return noteRepository.findAccessibleById(id, userId);
};

const deleteNote = async (id, userId) => {
  const existing = await noteRepository.findAccessibleById(id, userId);
  if (!existing) {
    throw new NotFoundError('Note not found');
  }

  assertOwner(existing, userId);

  await noteRepository.softDeleteById(id);
};

const shareNote = async (id, email, userId) => {
  const note = await noteRepository.findAccessibleById(id, userId);
  if (!note) {
    throw new NotFoundError('Note not found');
  }

  assertOwner(note, userId);

  const target = await userRepository.findByEmail(email);
  if (!target) {
    throw new NotFoundError('Target user not found');
  }

  if (target.id === userId) {
    throw new BadRequestError('Cannot share with self');
  }

  const existing = await noteShareRepository.findExisting(id, target.id);
  if (existing) {
    throw new ConflictError('Note is already shared with this user');
  }

  return noteShareRepository.create({ noteId: id, sharedWithId: target.id, permission: 'READ' });
};

const listHistory = async (id, userId) => {
  const note = await noteRepository.findAccessibleById(id, userId);
  if (!note) {
    throw new NotFoundError('Note not found');
  }

  assertOwner(note, userId);

  return noteVersionRepository.listByNoteId(id);
};

const restoreVersion = async (id, versionId, version, userId) => {
  const note = await noteRepository.findAccessibleById(id, userId);
  if (!note) {
    throw new NotFoundError('Note not found');
  }

  assertOwner(note, userId);

  const historicalVersion = await noteVersionRepository.findById(versionId);
  if (!historicalVersion || historicalVersion.noteId !== id) {
    throw new NotFoundError('Version not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.noteVersion.create({
      data: {
        noteId: note.id,
        title: note.title,
        content: note.content,
        editorId: userId,
        noteVersion: note.version
      }
    });

    const restored = await tx.note.updateMany({
      where: { id, version, deletedAt: null },
      data: {
        title: historicalVersion.title,
        content: historicalVersion.content,
        version: { increment: 1 }
      }
    });

    if (restored.count === 0) {
      throw new ConflictError('Restore conflict. Please refresh and retry.');
    }
  });

  return noteRepository.findAccessibleById(id, userId);
};

module.exports = {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  listHistory,
  restoreVersion
};
