const express = require('express');
const { about, openapi } = require('../controllers/metaController');

const router = express.Router();

router.get('/about', about);
router.get('/openapi.json', openapi);

module.exports = router;
