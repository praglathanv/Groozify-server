const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // Import the middleware

// Public routes
router.post('/signup', authController.signup);
router.post('/verify-email', authController.verifyEmail); // Use verifyEmail instead of verify-phone
router.post('/check-verification', authController.checkVerification); // Use checkVerification instead of check-otp
router.post('/login', authController.login);

// Protected route
router.get('/check-auth', authenticateToken, (req, res) => {
    res.json({ message: 'User is authenticated' });
});

router.post('/logout', authController.logout);

module.exports = router;