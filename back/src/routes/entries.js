const express = require('express');
const router = express.Router();
const { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry, getUserEntries } = require('../controllers/entries');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const prisma = require('../config/prisma');
// Crear un middleware para verificar si es el propietario de la entrada
// Esta función debe ir en el archivo middleware/auth.js
const isEntryOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await prisma.entry.findUnique({ where: { id } });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    // Si el usuario es admin o es el propietario de la entrada
    if (req.isAdmin || entry.userId === req.user.id) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this entry'
    });
  } catch (error) {
    next(error);
  }
};

//Specific route for user entries
router.get('/user-entries', authMiddleware, getUserEntries);

// Rutas que requieren autenticación opcional
router.get('/', authMiddleware, getAllEntries);
router.get('/:id', authMiddleware, getEntryById);

// Protected routes
router.post('/', authMiddleware, createEntry);
router.put('/:id', authMiddleware, isEntryOwner, updateEntry);
router.delete('/:id', authMiddleware, isEntryOwner, deleteEntry);

module.exports = router;