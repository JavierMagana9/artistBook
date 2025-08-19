# Artist Book 🎨

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern platform for artists to share and manage their creative work. Built with React, Node.js, PostgreSQL, and Firebase.

**[🇪🇸 Versión en Español](#-artist-book-versión-en-español)** | **🇺🇸 English Version**

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-project-architecture)
- [Quick Start](#-quick-start)
- [Available Scripts](#-available-scripts)
- [Database](#-database)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Technologies](#-technologies-used)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🌟 Features

### 👤 **User Management**
- ✅ Firebase Authentication (Email/Password + Google OAuth)
- ✅ User roles (USER/ADMIN)
- ✅ Customizable profiles
- ✅ Complete admin panel

### 📝 **Entry Management**
- ✅ Create, edit, and delete entries
- ✅ Support for text and images
- ✅ Visibility control (Private/Public)
- ✅ Preview and complete details

### 🎨 **Design and UX**
- ✅ Mobile-first responsive design
- ✅ Hamburger menu for mobile
- ✅ Animations with Waves.js
- ✅ Modern interface with Tailwind CSS
- ✅ Enhanced accessibility (ARIA labels, keyboard navigation)

### 🔐 **Security**
- ✅ JWT authentication with Firebase
- ✅ Authorization middleware
- ✅ Data validation
- ✅ CORS configured
- ✅ Security headers with Helmet

## 🏗️ Project Architecture

```
artistBook/
├── 📁 front/                    # Frontend React + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable components
│   │   ├── 📁 pages/           # Main pages
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 routes/          # Route configuration
│   │   └── 📁 utils/           # Utilities and API
│   └── 📁 public/              # Static files
├── 📁 back/                    # Backend Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Business logic
│   │   ├── 📁 middleware/      # Custom middleware
│   │   ├── 📁 routes/          # Route definitions
│   │   ├── 📁 config/          # Configurations
│   │   └── 📁 utils/           # Utilities
│   └── 📁 prisma/              # Database schemas
└── 📄 README.md               # This file
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- Firebase account
- Git

### **1. Clone the repository**

```bash
git clone https://github.com/your-username/artist-book.git
cd artist-book
```

### **2. Configure Backend**

```bash
# Navigate to backend
cd back

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` with your configurations:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/artistbook"

# JWT
JWT_SECRET="your-super-secure-jwt-secret"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"

# CORS
FRONTEND_URL="http://localhost:5173"
```

**Configure Database:**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

**Start server:**

```bash
npm run dev
# Server running on http://localhost:5000
```

### **3. Configure Frontend**

```bash
# Navigate to frontend
cd ../front

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `.env.local` with your configurations:

```env
# API Backend
VITE_API_URL="http://localhost:5000/api"

# Firebase Client SDK
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
```

**Start application:**

```bash
npm run dev
# Application running on http://localhost:5173
```

## 🔧 Available Scripts

### Backend

```bash
npm run dev          # Development with nodemon
npm start           # Production
npm run test        # Run tests
npm run prisma:studio # Database GUI
npm run prisma:reset  # Reset database
```

### Frontend

```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # ESLint linting
```

## 🗃️ Database

### Main Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  provider  String   @default("email")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  entries   Entry[]
}

model Entry {
  id         String     @id @default(cuid())
  title      String
  content    String?
  imageUrl   String?
  visibility Visibility @default(PRIVATE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  
  userId     String
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

enum Visibility {
  PRIVATE
  PUBLIC
}
```

## 📡 API Endpoints

### **🔐 Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/google` | Google login |
| `GET` | `/api/auth/verify` | Verify JWT token |

### **👤 Users**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | Get current profile |
| `PUT` | `/api/users/profile` | Update profile |
| `GET` | `/api/users` | List users (ADMIN) |
| `GET` | `/api/users/:id` | Get user by ID (ADMIN) |
| `PUT` | `/api/users/:id` | Update user (ADMIN) |
| `DELETE` | `/api/users/:id` | Delete user (ADMIN) |

### **📝 Entries**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/entries` | List user's entries |
| `GET` | `/api/entries/public` | List public entries |
| `GET` | `/api/entries/:id` | Get entry by ID |
| `POST` | `/api/entries` | Create new entry |
| `PUT` | `/api/entries/:id` | Update entry |
| `DELETE` | `/api/entries/:id` | Delete entry |

### Request/Response Example

**POST** `/api/entries`

```json
// Request
{
  "title": "My new artwork",
  "content": "Description of the artwork...",
  "imageUrl": "https://example.com/image.jpg",
  "visibility": "PUBLIC"
}

// Response
{
  "success": true,
  "data": {
    "id": "clm7x2k3f0000...",
    "title": "My new artwork",
    "content": "Description of the artwork...",
    "imageUrl": "https://example.com/image.jpg",
    "visibility": "PUBLIC",
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T10:30:00.000Z",
    "userId": "clm7x2k3f0001..."
  }
}
```

## 🚀 Deployment

### Option 1: Vercel + Railway (Recommended)

#### Backend on Railway:
1. Create account on [Railway](https://railway.app/)
2. Connect GitHub repository
3. Configure environment variables:

```env
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}  # Auto-generated by Railway
JWT_SECRET=your-jwt-secret-production
FIREBASE_PROJECT_ID=your-project-id
# ... rest of Firebase variables
FRONTEND_URL=https://your-app.vercel.app
```

#### Frontend on Vercel:
1. Create account on [Vercel](https://vercel.com/)
2. Import repository
3. Configure Root Directory: `front`
4. Configure environment variables:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
# ... rest of Firebase variables
```

### Option 2: Render (All-in-one)

Create `render.yaml` file:

```yaml
services:
  - type: web
    name: artist-book-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: artist-book-db
          property: connectionString

  - type: web
    name: artist-book-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - SPA navigation
- **Axios** - HTTP client
- **React Icons** - Iconography
- **Waves.js** - Wave animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Relational database
- **Firebase Admin** - Authentication
- **JWT** - Authentication tokens
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server
- **Concurrently** - Run scripts in parallel

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend and DB hosting
- **Firebase Console** - Authentication management

## 🎯 Technical Features

### Performance
- ⚡ Fast loading with Vite
- 🔄 Automatic code splitting
- 📱 Component lazy loading
- 🖼️ Image optimization

### Security
- 🔐 Multi-provider authentication
- 🛡️ Input validation
- 🔒 Security headers
- 🚫 CSRF protection

### Accessibility
- ♿ Complete ARIA labels
- ⌨️ Keyboard navigation
- 🎨 WCAG color contrast
- 📱 Responsive design

### SEO and PWA
- 🔍 Optimized meta tags
- 📱 Multi-platform favicon
- 🌐 PWA manifest
- 📊 Semantic structure

## 🐛 Troubleshooting

### Common Issues

#### Database connection error
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check connection URL
echo $DATABASE_URL
```

#### Firebase errors
```bash
# Check Firebase configuration
firebase projects:list

# Check service account permissions
```

#### Port already in use
```bash
# Find process using the port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Logs and Debugging

```bash
# Backend logs
npm run dev -- --verbose

# Prisma debugging
DEBUG="prisma*" npm run dev

# Frontend debugging
VITE_DEBUG=true npm run dev
```



**Developed with ❤️ by [Javi Magaña](https://github.com/JavierMagana9)**



---

# 🇪🇸 Artist Book - Versión en Español

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Una plataforma moderna para que los artistas compartan y gestionen su trabajo creativo. Construida con React, Node.js, PostgreSQL y Firebase.

**# 🇪🇸 Artist Book - Versión en Español** | **[🇺🇸 English Version](#artist-book-)**

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura-del-proyecto)
- [Inicio Rápido](#-inicio-rápido)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Tecnologías](#-tecnologías-utilizadas)
- [Troubleshooting](#-troubleshooting)
- [Licencia](#-licencia)

## 🌟 Características

### 👤 **Gestión de Usuarios**
- ✅ Autenticación con Firebase (Email/Password + Google OAuth)
- ✅ Roles de usuario (USER/ADMIN)
- ✅ Perfiles personalizables
- ✅ Panel de administración completo

### 📝 **Gestión de Entradas**
- ✅ Crear, editar y eliminar entradas
- ✅ Soporte para texto e imágenes
- ✅ Control de visibilidad (Privado/Público)
- ✅ Vista previa y detalles completos

### 🎨 **Diseño y UX**
- ✅ Diseño responsive mobile-first
- ✅ Menú hamburguesa para móviles
- ✅ Animaciones con Waves.js
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Accesibilidad mejorada (ARIA labels, navegación por teclado)

### 🔐 **Seguridad**
- ✅ Autenticación JWT con Firebase
- ✅ Middleware de autorización
- ✅ Validación de datos
- ✅ CORS configurado
- ✅ Headers de seguridad con Helmet

## 🏗️ Arquitectura del Proyecto

```
artistBook/
├── 📁 front/                    # Frontend React + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/       # Componentes reutilizables
│   │   ├── 📁 pages/           # Páginas principales
│   │   ├── 📁 contexts/        # Contextos de React
│   │   ├── 📁 routes/          # Configuración de rutas
│   │   └── 📁 utils/           # Utilidades y API
│   └── 📁 public/              # Archivos estáticos
├── 📁 back/                    # Backend Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Lógica de negocio
│   │   ├── 📁 middleware/      # Middleware personalizado
│   │   ├── 📁 routes/          # Definición de rutas
│   │   ├── 📁 config/          # Configuraciones
│   │   └── 📁 utils/           # Utilidades
│   └── 📁 prisma/              # Esquemas de base de datos
└── 📄 README.md               # Este archivo
```

## 🚀 Inicio Rápido

### **Prerequisitos**
- Node.js 18+
- PostgreSQL 14+
- Cuenta de Firebase
- Git

### **1. Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/artist-book.git
cd artist-book
```

### **2. Configurar Backend**

```bash
# Navegar al backend
cd back

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/artistbook"

# JWT
JWT_SECRET="tu-jwt-secret-super-seguro"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="tu-project-id"
FIREBASE_PRIVATE_KEY_ID="tu-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="tu-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"

# CORS
FRONTEND_URL="http://localhost:5173"
```

**Configurar Base de Datos:**

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos de ejemplo
npx prisma db seed
```

**Iniciar servidor:**

```bash
npm run dev
# Servidor corriendo en http://localhost:5000
```

### **3. Configurar Frontend**

```bash
# Navegar al frontend
cd ../front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

Editar `.env.local` con tus configuraciones:

```env
# API Backend
VITE_API_URL="http://localhost:5000/api"

# Firebase Client SDK
VITE_FIREBASE_API_KEY="tu-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="tu-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="tu-project-id"
VITE_FIREBASE_STORAGE_BUCKET="tu-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
```

**Iniciar aplicación:**

```bash
npm run dev
# Aplicación corriendo en http://localhost:5173
```

## 🔧 Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm run test        # Ejecutar tests
npm run prisma:studio # Interface gráfica de BD
npm run prisma:reset  # Resetear base de datos
```

### Frontend

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run preview     # Vista previa del build
npm run lint        # Linting con ESLint
```

## 🗃️ Base de Datos

### Esquema Principal

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  provider  String   @default("email")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  entries   Entry[]
}

model Entry {
  id         String     @id @default(cuid())
  title      String
  content    String?
  imageUrl   String?
  visibility Visibility @default(PRIVATE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  
  userId     String
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

enum Visibility {
  PRIVATE
  PUBLIC
}
```

## 📡 API Endpoints

### **🔐 Autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login con email/password |
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/google` | Login con Google |
| `GET` | `/api/auth/verify` | Verificar token JWT |

### **👤 Usuarios**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | Obtener perfil actual |
| `PUT` | `/api/users/profile` | Actualizar perfil |
| `GET` | `/api/users` | Listar usuarios (ADMIN) |
| `GET` | `/api/users/:id` | Obtener usuario por ID (ADMIN) |
| `PUT` | `/api/users/:id` | Actualizar usuario (ADMIN) |
| `DELETE` | `/api/users/:id` | Eliminar usuario (ADMIN) |

### **📝 Entradas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/entries` | Listar entradas del usuario |
| `GET` | `/api/entries/public` | Listar entradas públicas |
| `GET` | `/api/entries/:id` | Obtener entrada por ID |
| `POST` | `/api/entries` | Crear nueva entrada |
| `PUT` | `/api/entries/:id` | Actualizar entrada |
| `DELETE` | `/api/entries/:id` | Eliminar entrada |

### Ejemplo de Request/Response

**POST** `/api/entries`

```json
// Request
{
  "title": "Mi nueva obra",
  "content": "Descripción de la obra...",
  "imageUrl": "https://example.com/image.jpg",
  "visibility": "PUBLIC"
}

// Response
{
  "success": true,
  "data": {
    "id": "clm7x2k3f0000...",
    "title": "Mi nueva obra",
    "content": "Descripción de la obra...",
    "imageUrl": "https://example.com/image.jpg",
    "visibility": "PUBLIC",
    "createdAt": "2023-12-07T10:30:00.000Z",
    "updatedAt": "2023-12-07T10:30:00.000Z",
    "userId": "clm7x2k3f0001..."
  }
}
```

## 🚀 Deployment

### Opción 1: Vercel + Railway (Recomendado)

#### Backend en Railway:
1. Crear cuenta en [Railway](https://railway.app/)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno:

```env
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}  # Auto-generada por Railway
JWT_SECRET=tu-jwt-secret-production
FIREBASE_PROJECT_ID=tu-project-id
# ... resto de variables Firebase
FRONTEND_URL=https://tu-app.vercel.app
```

#### Frontend en Vercel:
1. Crear cuenta en [Vercel](https://vercel.com/)
2. Importar repositorio
3. Configurar Root Directory: `front`
4. Configurar variables de entorno:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
VITE_FIREBASE_API_KEY=tu-firebase-api-key
# ... resto de variables Firebase
```

### Opción 2: Render (Todo en uno)

Crear archivo `render.yaml`:

```yaml
services:
  - type: web
    name: artist-book-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: artist-book-db
          property: connectionString

  - type: web
    name: artist-book-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **Waves.js** - Animaciones de ondas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Base de datos relacional
- **Firebase Admin** - Autenticación
- **JWT** - Tokens de autenticación
- **Helmet** - Headers de seguridad
- **CORS** - Cross-origin resource sharing

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Nodemon** - Auto-restart del servidor
- **Concurrently** - Ejecutar scripts en paralelo

### Deployment
- **Vercel** - Hosting frontend
- **Railway** - Hosting backend y BD
- **Firebase Console** - Gestión de autenticación

## 🎯 Características Técnicas

### Performance
- ⚡ Carga rápida con Vite
- 🔄 Code splitting automático
- 📱 Lazy loading de componentes
- 🖼️ Optimización de imágenes

### Seguridad
- 🔐 Autenticación multi-proveedor
- 🛡️ Validación de entrada
- 🔒 Headers de seguridad
- 🚫 Protección CSRF

### Accesibilidad
- ♿ ARIA labels completos
- ⌨️ Navegación por teclado
- 🎨 Contraste de colores WCAG
- 📱 Responsive design

### SEO y PWA
- 🔍 Meta tags optimizados
- 📱 Favicon multi-plataforma
- 🌐 Manifest para PWA
- 📊 Estructura semántica

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar la URL de conexión
echo $DATABASE_URL
```

#### Errores de Firebase
```bash
# Verificar configuración de Firebase
firebase projects:list

# Verificar permisos del service account
```

#### Puerto ya en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :5000

# Terminar proceso
kill -9 <PID>
```

### Logs y Debugging

```bash
# Backend logs
npm run dev -- --verbose

# Prisma debugging
DEBUG="prisma*" npm run dev

# Frontend debugging
VITE_DEBUG=true npm run dev
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ por [Javi Magaña](https://github.com/JavierMagana9)**

