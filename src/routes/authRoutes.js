const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshSchema), authController.refreshToken);
router.post('/logout', validate(refreshSchema), authController.logout);

module.exports = router;
