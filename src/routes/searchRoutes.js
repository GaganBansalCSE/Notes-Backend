const express = require('express');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { searchSchema } = require('../validators/noteValidator');
const { search } = require('../controllers/searchController');

const router = express.Router();

router.get('/search', authenticate, validate(searchSchema, 'query'), search);

module.exports = router;
