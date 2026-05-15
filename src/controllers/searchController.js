const asyncHandler = require('../utils/asyncHandler');
const searchService = require('../services/searchService');

const search = asyncHandler(async (req, res) => {
  const results = await searchService.searchNotes(req.user.id, req.query);
  res.status(200).json(results);
});

module.exports = { search };
