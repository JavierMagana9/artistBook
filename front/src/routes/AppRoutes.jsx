import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import api from '../utils/api';

// Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AdminPanel from '../pages/AdminPanel';
import EntryForm from '../pages/EntryForm';
import EntryDetails from '../pages/EntryDetails';
import EditEntry from '../pages/EditEntry';

function PrivateRoute({ children, requireAdmin = false }) {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) return <Navigate to="/login" />;
  
  if (requireAdmin && userData?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

// Componente para rutas públicas (sin Layout)
function PublicRoute({ children }) {
  return children;
}

export default function AppRoutes() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/entries/new"
        element={
          <PrivateRoute>
            <EntryForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/entries/:id"
        element={
          <PrivateRoute>
            <EntryDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/entries/:id/edit"
        element={
          <PrivateRoute>
            <EditEntry />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
