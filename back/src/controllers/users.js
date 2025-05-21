const prisma = require('../utils/prisma');
const { AppError } = require('../utils/errorHandler');

// Get current user profile
const getUserProfile = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return next(new AppError('Name is required', 400));
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name }
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { entries: true }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res, next) => {
  try {
    // Verificar que sea administrador (aunque el middleware ya debería haberlo hecho)
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can delete users'
      });
    }

    const { id } = req.params;
    
    // No permitir que un admin se elimine a sí mismo
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      });
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Primero eliminamos todas las entradas del usuario
    await prisma.entry.deleteMany({
      where: { userId: id }
    });

    // Luego eliminamos el usuario
    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'User and all their entries deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { entries: true }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  deleteUser
};