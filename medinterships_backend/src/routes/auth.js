const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { loginValidation, handleValidationErrors } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.get('/refresh', authController.refreshToken);

// Protected routes
router.use(protect);
router.post('/logout', authController.logout);
router.patch('/change-password', authController.changePassword);
router.get('/me', authController.getMe);

module.exports = router;
