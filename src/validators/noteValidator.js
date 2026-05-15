const { z } = require('zod');

const noteBodySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000)
});

const noteUpdateSchema = noteBodySchema.extend({
  version: z.number().int().positive()
});

const shareSchema = z.object({
  email: z.string().email()
});

const restoreSchema = z.object({
  version: z.number().int().positive()
});

const listNotesSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  ownedOnly: z.coerce.boolean().optional()
});

const searchSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional()
});

module.exports = {
  noteBodySchema,
  noteUpdateSchema,
  shareSchema,
  restoreSchema,
  listNotesSchema,
  searchSchema
};
