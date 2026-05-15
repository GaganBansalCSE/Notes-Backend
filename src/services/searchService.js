const { prisma, Prisma } = require('../config/prisma');
const { parsePagination } = require('../utils/pagination');

const searchNotes = async (userId, query) => {
  const pagination = parsePagination(query);

  const sql = Prisma.sql`
    SELECT n.*
    FROM "Note" n
    WHERE n."deletedAt" IS NULL
      AND (n."ownerId" = ${userId} OR EXISTS (
        SELECT 1 FROM "NoteShare" ns
        WHERE ns."noteId" = n.id AND ns."sharedWithId" = ${userId}
      ))
      AND to_tsvector('english', coalesce(n.title,'') || ' ' || coalesce(n.content,'')) @@ plainto_tsquery('english', ${query.q})
    ORDER BY n."updatedAt" DESC
    LIMIT ${pagination.take} OFFSET ${pagination.skip}
  `;

  const countSql = Prisma.sql`
    SELECT COUNT(*)::int AS total
    FROM "Note" n
    WHERE n."deletedAt" IS NULL
      AND (n."ownerId" = ${userId} OR EXISTS (
        SELECT 1 FROM "NoteShare" ns
        WHERE ns."noteId" = n.id AND ns."sharedWithId" = ${userId}
      ))
      AND to_tsvector('english', coalesce(n.title,'') || ' ' || coalesce(n.content,'')) @@ plainto_tsquery('english', ${query.q})
  `;

  const [notes, countResult] = await Promise.all([prisma.$queryRaw(sql), prisma.$queryRaw(countSql)]);
  const total = countResult[0]?.total ?? 0;

  return {
    items: notes,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: notes.length,
      total,
      pages: Math.ceil(total / pagination.limit) || 1
    }
  };
};

module.exports = { searchNotes };
