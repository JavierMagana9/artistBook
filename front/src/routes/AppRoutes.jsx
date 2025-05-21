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
import EntryDetail from '../pages/EntryDetail';
import EditEntry from '../pages/EditEntry';

function PrivateRoute({ children, requireAdmin = false }) {
  const { currentUser, userData, loading } = useAuth();
  
  // Debug para ver qué está pasando
  console.log("PrivateRoute Check:", { 
    requireAdmin, 
    currentUser: !!currentUser,
    userDataExists: !!userData,
    userRole: userData?.role,
    isAdmin: userData?.role === 'ADMIN'
  });
  
  if (loading) return <div>Loading authentication...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  // Solo comprueba rol si requireAdmin es true
  if (requireAdmin && userData?.role !== 'ADMIN') {
    console.log("Access denied: User is not admin");
    return <Navigate to="/dashboard" />;
  }
  
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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
            <EntryDetail />
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
