const express = require('express');
const router = express.Router();
const { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry } = require('../controllers/entries');
const { authMiddleware, isEntryOwner } = require('../middleware/auth');

// Public routes
router.get('/', getAllEntries);
router.get('/:id', getEntryById);

// Protected routes
router.post('/', authMiddleware, createEntry);
router.put('/:id', authMiddleware, isEntryOwner, updateEntry);
router.delete('/:id', authMiddleware, isEntryOwner, deleteEntry);

module.exports = router;