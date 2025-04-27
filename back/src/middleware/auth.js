const admin = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const prisma = require('../utils/prisma');

// Verify Firebase token and attach user to request
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authenticated. No token provided.', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { firebaseId: decodedToken.uid }
    });
    
    if (!user) {
      // First time login, create user in our database
      user = await prisma.user.create({
        data: {
          firebaseId: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0]
        }
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authenticated. Invalid token.', 401));
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new AppError('Not authorized. Admin access required.', 403));
  }
  next();
};

// Check if user owns the entry
const isEntryOwner = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.id;
    
    const entry = await prisma.entry.findUnique({
      where: { id: entryId }
    });
    
    if (!entry) {
      return next(new AppError('Entry not found', 404));
    }
    
    if (entry.userId !== userId && req.user.role !== 'ADMIN') {
      return next(new AppError('Not authorized. You do not own this entry.', 403));
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, isAdmin, isEntryOwner };