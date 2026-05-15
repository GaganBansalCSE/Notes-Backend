const { BadRequestError } = require('../errors/AppError');

const parsePagination = ({ page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' }) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    throw new BadRequestError('Invalid pagination page');
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new BadRequestError('Invalid pagination limit');
  }

  const allowedSortFields = ['createdAt', 'updatedAt', 'title'];
  if (!allowedSortFields.includes(sortBy)) {
    throw new BadRequestError('Invalid sortBy field');
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new BadRequestError('Invalid sortOrder value');
  }

  return {
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit,
    page: parsedPage,
    limit: parsedLimit,
    orderBy: { [sortBy]: sortOrder }
  };
};

module.exports = { parsePagination };
