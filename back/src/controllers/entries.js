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

// In your getAllEntries controller
const getAllEntries = async (req, res, next) => {
  try {
    console.log("Request headers:", req.headers.authorization ? "Token presente" : "Sin token");
    console.log("Request object tiene user?", !!req.user);
    console.log("Request object tiene isAdmin?", typeof req.isAdmin !== 'undefined');
    console.log("Valor de isAdmin:", req.isAdmin);
    
    const userId = req.user?.id;
    const isAdmin = req.isAdmin === true; // Coerción explícita a booleano
    
    console.log("Getting entries for user:", userId, "Is Admin:", isAdmin);
    
    let entries;
    
    if (isAdmin) {
      // Important: This SQL-like query should return ALL entries for admins
      console.log("Admin user detected - fetching ALL entries");
      entries = await prisma.entry.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log(`Found ${entries.length} total entries for admin, including private entries`);
      console.log("Sample entries:", entries.slice(0, 2).map(e => ({ 
        id: e.id, 
        title: e.title, 
        visibility: e.visibility, 
        userId: e.userId 
      })));
    } else if (userId) {
      // Regular users see public entries and their own entries
      entries = await prisma.entry.findMany({
        where: {
          OR: [
            { visibility: 'PUBLIC' },
            { userId: userId }
          ]
        },
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
      console.log("User view - public and own entries:", entries.length);
    } else {
      // Non-authenticated users only see public entries
      entries = await prisma.entry.findMany({
        where: { visibility: 'PUBLIC' },
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
      console.log("Public view - only public entries:", entries.length);
    }
    
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
// In your entries controller
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
      orderBy: {  // Colocado al mismo nivel que where e include
        createdAt: 'desc'
      }
    });
    
    console.log("User ID for entries:", userId);
    console.log("Found entries:", entries.length);
    console.log("Entry data sample:", entries.slice(0, 2));
    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error("Error in getUserEntries:", error);
    next(error);
  }
};

// Get a single entry by ID
const getEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }

    // Añade logs para depuración
    console.log('Entry access check:', {
      entryId: id,
      entryUserId: entry.userId,
      entryVisibility: entry.visibility,
      requestUserId: req.user.id,
      isAdmin: req.isAdmin,
      isOwner: entry.userId === req.user.id,
      isPublic: entry.visibility === 'PUBLIC'
    });

    // Verificar permisos
    if (req.isAdmin || entry.userId === req.user.id || entry.visibility === 'PUBLIC') {
      return res.status(200).json({
        success: true,
        data: entry
      });
    }

    // Si no cumple ninguna condición anterior, no está autorizado
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this entry'
    });
  } catch (error) {
    console.error('Error retrieving entry:', error);
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