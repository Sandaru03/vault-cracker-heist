const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected session route
router.get('/me', verifyToken, authController.getMe);
router.get('/session', verifyToken, authController.getMe);

module.exports = router;

