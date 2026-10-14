// Links my controllers to index.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the guard

router.post('/register', authController.register);
router.post('/login', authController.login);

// New protected profile route
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
