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

// Ruta para obtener perfil (verifica que getUserProfile esté importado correctamente)
router.get('/profile', authMiddleware, getUserProfile);

// Otras rutas
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;