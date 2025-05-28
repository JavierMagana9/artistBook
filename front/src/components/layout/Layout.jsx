import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

export default function Layout({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Rutas públicas que no necesitan header
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Solo mostrar Header si hay usuario autenticado y no es ruta pública */}
      {currentUser && !isPublicRoute && <Header />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}