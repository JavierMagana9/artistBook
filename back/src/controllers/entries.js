const prisma = require('../utils/prisma');
const { AppError } = require('../utils/errorHandler');

// Create a new entry
const createEntry = async (req, res, next) => {
  try {
    const { title, content, imageUrl, visibility } = req.body;
    
    if (!title || !content) {
      return next(new AppError('Title and content are required', 400));
    }
    
    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        imageUrl,
        visibility: visibility || 'PRIVATE',
        userId: req.user.id
      }
    });
    
    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

// Get all entries (public ones from other users, all from current user)
const getAllEntries = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    // Build query conditions
    const where = userId
      ? {
          OR: [
            { visibility: 'PUBLIC' },
            { userId: userId }
          ]
        }
      : { visibility: 'PUBLIC' };
    
    const entries = await prisma.entry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    next(error);
  }
};

// Get a single entry by ID
const getEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!entry) {
      return next(new AppError('Entry not found', 404));
    }
    
    // Check if the entry is private and doesn't belong to current user
    if (entry.visibility === 'PRIVATE' && entry.userId !== userId) {
      return next(new AppError('Not authorized to view this entry', 403));
    }
    
    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

// Update an entry
const updateEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, visibility } = req.body;
    
    if (!title && !content && !imageUrl && !visibility) {
      return next(new AppError('Nothing to update', 400));
    }
    
    const updatedEntry = await prisma.entry.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(visibility && { visibility })
      }
    });
    
    res.status(200).json({
      success: true,
      data: updatedEntry
    });
  } catch (error) {
    next(error);
  }
};

// Delete an entry
const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.entry.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry
};