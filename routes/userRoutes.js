const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.Middleware');

// Public route - Create a user (Sign-up)
router.post('/register', userController.registerUser);

// Public route - Create a user (Sign-up)
router.post('/login', userController.loginUser);

// Protected routes - Require authentication
router.get('/:id', authMiddleware.verifyUserOrEmployee, userController.getUser);
router.put('/:id', authMiddleware.verifyUserOrAdmin, userController.updateUser);
router.delete('/:id', authMiddleware.verifyUserOrAdmin, userController.deleteUser);

module.exports = router;