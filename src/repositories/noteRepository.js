const { prisma } = require('../config/prisma');

const create = (data) => prisma.note.create({ data });

const findAccessibleById = (id, userId) =>
  prisma.note.findFirst({
    where: {
      id,
      deletedAt: null,
      OR: [{ ownerId: userId }, { shares: { some: { sharedWithId: userId } } }]
    },
    include: { shares: { include: { sharedWith: { select: { id: true, email: true } } } }, owner: true }
  });

const listAccessible = ({ userId, skip, take, orderBy, ownedOnly = false }) =>
  prisma.note.findMany({
    where: {
      deletedAt: null,
      ...(ownedOnly
        ? { ownerId: userId }
        : { OR: [{ ownerId: userId }, { shares: { some: { sharedWithId: userId } } }] })
    },
    skip,
    take,
    orderBy,
    include: { owner: { select: { id: true, email: true } }, shares: true }
  });

const countAccessible = ({ userId, ownedOnly = false }) =>
  prisma.note.count({
    where: {
      deletedAt: null,
      ...(ownedOnly
        ? { ownerId: userId }
        : { OR: [{ ownerId: userId }, { shares: { some: { sharedWithId: userId } } }] })
    }
  });

const updateByIdAndVersion = ({ id, version, data }) =>
  prisma.note.updateMany({ where: { id, version, deletedAt: null }, data: { ...data, version: { increment: 1 } } });

const softDeleteById = (id) => prisma.note.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = {
  create,
  findAccessibleById,
  listAccessible,
  countAccessible,
  updateByIdAndVersion,
  softDeleteById
};
