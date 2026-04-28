const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser } = require('../middleware/recordValidation');
const { authenticate } = require('../middleware/auth');

router.post('/register', [validateUser], authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verifyToken', authenticate, authController.verifyToken);

module.exports = router;