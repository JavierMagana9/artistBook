const express = require('express');
const router = express.Router();
const { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry, getUserEntries } = require('../controllers/entries');
const { authMiddleware, isEntryOwner } = require('../middleware/auth');

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