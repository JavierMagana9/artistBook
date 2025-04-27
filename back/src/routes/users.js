const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/users');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Just a placeholder route for now
router.get('/test', (req, res) => {
  res.json({ message: 'Users route working' });
});

// User routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
// Admin routes
router.get('/', authMiddleware, isAdmin, getAllUsers);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;