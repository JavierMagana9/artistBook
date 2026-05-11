const express = require('express');
const router = express.Router();

// Importar controladores específicamente - verifica que existan
const { 
  getAllUsers, 
  getUserById, 
  updateUserProfile, 
  deleteUser, 
  getUserProfile, 
  updateUser 
} = require('../controllers/users');

// Importar middleware
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Profile routes must be declared before '/:id' so Express does not treat
// the literal 'profile' segment as a dynamic user id.
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Otras rutas
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;