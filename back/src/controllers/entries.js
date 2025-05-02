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
// In your backend entries.js controller
// In your backend entries.js controller
const getAllEntries = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      console.log("Fetching entries for user ID:", userId);
      
      // Let's check if we have entries in the database
      const countAll = await prisma.entry.count();
      console.log("Total entries in database:", countAll);
      
      // Count private entries
      const countPrivate = await prisma.entry.count({
        where: { visibility: 'PRIVATE' }
      });
      console.log("Private entries in database:", countPrivate);
      
      // Direct approach: Get all public entries + user's private entries
      let entries = [];
      
      // Get all public entries
      const publicEntries = await prisma.entry.findMany({
        where: { visibility: 'PUBLIC' },
        include: { user: { select: { id: true, name: true } } },
      });
      console.log("Found public entries:", publicEntries.length);
      entries = [...publicEntries];
      
      // If user is logged in, add their private entries
      if (userId) {
        const privateEntries = await prisma.entry.findMany({
          where: { 
            AND: [
              { visibility: 'PRIVATE' },
              { userId: userId }
            ]
          },
          include: { user: { select: { id: true, name: true } } },
        });
        console.log("Found user's private entries:", privateEntries.length);
        entries = [...entries, ...privateEntries];
      }
      
      // Sort by creation date (newest first)
      entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log("Total entries to return:", entries.length);
      console.log("Entry visibilities:", entries.map(e => e.visibility));
      
      res.status(200).json({
        success: true,
        count: entries.length,
        data: entries
      });
    } catch (error) {
      console.error("Error in getAllEntries:", error);
      next(error);
    }
  };

// In your entries.js controller
const getUserEntries = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return next(new AppError('User not authenticated', 401));
      }
      
      // Get all entries belonging to the user regardless of visibility
      const entries = await prisma.entry.findMany({
        where: { userId: userId },
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
      
      console.log(`Found ${entries.length} entries for user ${userId}`);
      
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
    deleteEntry,
    getUserEntries
  };