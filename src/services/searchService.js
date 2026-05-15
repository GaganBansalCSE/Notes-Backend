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

  const notes = await prisma.$queryRaw(sql);

  return {
    items: notes,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: notes.length
    }
  };
};

module.exports = { searchNotes };
