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

// Agregar esta ruta
router.post('/register-oauth', async (req, res, next) => {
  try {
    const { email, name, photoURL, uid } = req.body;
    
    // Verificar si el usuario ya existe
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Crear nuevo usuario
      user = await prisma.user.create({
        data: {
          email,
          name,
          firebaseId: uid,
          imageUrl: photoURL || null,
          role: 'USER' // Por defecto, los usuarios OAuth son usuarios normales
        }
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.get('/', authMiddleware, isAdmin, getAllUsers);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;