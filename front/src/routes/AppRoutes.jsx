import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { setAuthToken } from '../utils/api';

// Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AdminPanel from '../pages/AdminPanel';
import EntryForm from '../pages/EntryForm';
//import EntryDetails from '../pages/EntryDetails';

// Private route component
function PrivateRoute({ children, requireAdmin = false }) {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!currentUser) return <Navigate to="/login" />;
  
  if (requireAdmin && userData?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

export default function AppRoutes() {
  const { token } = useAuth();
  
  // Set auth token when it changes
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute requireAdmin={true}>
            <AdminPanel />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/entries/new" 
        element={
            <PrivateRoute>
            <EntryForm />
            </PrivateRoute>
        } />

      {/* Default route */}
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" />} 
      />
      
      {/* Catch-all for unmatched routes */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}