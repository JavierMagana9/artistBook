const express = require('express');
const router = express.Router();
const { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry, getUserEntries } = require('../controllers/entries');
const { authMiddleware, adminMiddleware, isEntryOwner } = require('../middleware/auth');

//Specific route for user entries
router.get('/user-entries', authMiddleware, getUserEntries);

// Routes for entries
router.get('/', authMiddleware, getAllEntries);
router.get('/:id', authMiddleware, getEntryById);

// Routes for creating, updating, and deleting entries
router.post('/', authMiddleware, createEntry);
router.put('/:id', authMiddleware, isEntryOwner, updateEntry);
router.delete('/:id', authMiddleware, isEntryOwner, deleteEntry);

module.exports = router;