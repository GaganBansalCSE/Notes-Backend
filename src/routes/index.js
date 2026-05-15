const express = require('express');
const authRoutes = require('./authRoutes');
const noteRoutes = require('./noteRoutes');
const searchRoutes = require('./searchRoutes');
const metaRoutes = require('./metaRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(noteRoutes);
router.use(searchRoutes);
router.use(metaRoutes);

module.exports = router;
