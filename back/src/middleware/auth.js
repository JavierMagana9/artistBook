const admin = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');
const prisma = require('../utils/prisma');

// Verify Firebase token and attach user to request
const authMiddleware = async (req, res, next) => {
  try {
    // Inicializar valores por defecto explícitamente
    req.user = null;
    req.isAdmin = false;

    const authHeader = req.headers.authorization;

    console.log('Auth headers:', req.headers.authorization ? 'Token presente' : 'No hay token');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ No hay token o formato incorrecto');
      return next(); // Continuar sin error, solo con valores por defecto
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido (primeros 20 caracteres):', token.substring(0, 20) + '...');

    try {
      // Verify the token with Firebase
      const decodedToken = await admin.auth().verifyIdToken(token);
      const email = decodedToken.email;

      // Buscar usuario por email en lugar de por firebaseId
      let user = await prisma.user.findUnique({
        where: { email: email }
      });

      console.log('Usuario encontrado en DB:', user ? 'Sí' : 'No');

      if (!user) {
        // First time login, create user in our database
        const displayName = decodedToken.name || decodedToken.email.split('@')[0];
        
        user = await prisma.user.create({
          data: {
            firebaseId: decodedToken.uid,
            email: decodedToken.email,
            name: displayName,
            role: 'USER',
            provider: decodedToken.firebase.sign_in_provider || 'email'
          }
        });
        console.log('Nuevo usuario creado:', user.email);
      }

      // Attach user to request
      req.user = user;
      req.isAdmin = user.role === 'ADMIN';
      console.log(`Usuario adjuntado a request: ID=${user.id}, Admin=${req.isAdmin}`);
      next();
    } catch (tokenError) {
      console.error('❌ Error verificando token:', tokenError.message);
      return next(new AppError('Not authenticated. Invalid token.', 401));
    }
  } catch (error) {
    console.error('❌ Error general en authMiddleware:', error.message);
    req.user = null;
    req.isAdmin = false;
    next(); // Continuar con valores por defecto
  }

  // Al final del middleware, añade:
  console.log(`Valores finales: req.user=${!!req.user}, req.isAdmin=${req.isAdmin}`);
};

// Middleware para rutas que requieren ser administrador
const adminMiddleware = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// Verificar si el usuario es dueño de la entrada o es admin
const isEntryOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Si no está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Si es admin, permitir acceso sin verificar propiedad
    if (req.isAdmin) {
      return next();
    }
    
    // Buscar la entrada
    const entry = await prisma.entry.findUnique({
      where: { id }
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found'
      });
    }
    
    // Verificar si es el propietario
    if (entry.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this entry'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  isEntryOwner   // Exportar el nuevo middleware
};