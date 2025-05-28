import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Entries from './Entries';
import api from '../utils/api';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...'); // DEBUG
        
        // ✅ RUTA CORRECTA: /api/users/profile
        const response = await api.get('/users/profile');
        
        console.log('Profile response:', response.data); // DEBUG
        setProfile(response.data.data);
      } catch (err) {
        console.error('Error fetching profile:', err.response || err);
        setError('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <section className="text-center" role="status" aria-live="polite">
          <svg 
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600 mx-auto mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-base sm:text-lg text-gray-600">Loading dashboard...</p>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <section className="text-center max-w-sm sm:max-w-md mx-auto p-6 sm:p-8">
          <svg 
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500 mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h1>
          <p role="alert" className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Welcome header - Mobile optimized */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Welcome, {profile?.name || currentUser.email}
        </h1>
        {profile?.role && (
          <p className="text-base sm:text-lg text-gray-600">
            Role: <span className="font-medium text-indigo-600">{profile.role}</span>
          </p>
        )}
      </header>

      {/* Entries section */}
      <section aria-labelledby="entries-section">
        <h2 id="entries-section" className="sr-only">Your Entries</h2>
        <Entries />
      </section>
    </div>
  );
}