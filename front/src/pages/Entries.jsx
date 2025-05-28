// Create src/pages/Entries.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get('/entries');
        setEntries(res.data.data);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load entries');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleDeleteEntry = async (entryId, entryTitle) => {
    if (window.confirm(`Are you sure you want to delete "${entryTitle}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/entries/${entryId}`);
        // Update entries list
        setEntries(entries.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error deleting entry:', error);
        setError('Could not delete entry. Please try again.');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
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
          <p className="text-lg text-gray-600">Loading your entries...</p>
        </section>
      </main>
    );
  }

  return (
    
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Page header - Mobile responsive */}
        <header className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Entries</h1>
            <p className="mt-1 text-base sm:text-lg text-gray-600">
              Manage and view all your entries
            </p>
          </div>
          <Link
            to="/entries/new"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            aria-label="Create a new entry"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="sm:hidden">Create New Entry</span>
            <span className="hidden sm:inline">New Entry</span>
          </Link>
        </header>
        
        {/* Entries content */}
        <section className="bg-white rounded-lg shadow-sm">
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4 sm:px-6">
              <svg 
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No entries yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Get started by creating your first entry</p>
              <Link
                to="/entries/new"
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Create Your First Entry
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200" role="list" aria-label="Entries list">
              {entries.map(entry => (
                <li key={entry.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <article className="px-4 py-6 sm:px-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      
                      {/* Entry info - Mobile stacked */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-medium text-indigo-600 truncate mb-2">
                          <Link 
                            to={`/entries/${entry.id}`}
                            className="hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                          >
                            {entry.title}
                          </Link>
                        </h3>
                        
                        {/* Metadata - Mobile responsive */}
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                          <time dateTime={entry.createdAt} className="flex items-center">
                            <svg 
                              className="w-4 h-4 mr-1" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </time>
                          
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            entry.visibility === 'PUBLIC' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${
                              entry.visibility === 'PUBLIC' ? 'bg-green-400' : 'bg-yellow-400'
                            }`}></span>
                            {entry.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                          </span>
                        </div>
                        
                        {/* Entry preview */}
                        {entry.content && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {entry.content.substring(0, 150)}
                            {entry.content.length > 150 && '...'}
                          </p>
                        )}
                      </div>
                      
                      {/* Action buttons - Mobile stacked */}
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:ml-4">
                        <Link
                          to={`/entries/${entry.id}`}
                          className="w-full sm:w-auto inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                          aria-label={`View entry: ${entry.title}`}
                        >
                          <svg 
                            className="w-4 h-4 mr-1" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                        
                        {entry.userId === currentUser.uid && (
                          <div className="flex space-x-2">
                            <Link
                              to={`/entries/${entry.id}/edit`}
                              className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                              aria-label={`Edit entry: ${entry.title}`}
                            >
                              <svg 
                                className="w-4 h-4 mr-1" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="sm:hidden">Edit</span>
                              <span className="hidden sm:inline">Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteEntry(entry.id, entry.title)}
                              className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                              aria-label={`Delete entry: ${entry.title}`}
                            >
                              <svg 
                                className="w-4 h-4 mr-1" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="sm:hidden">Delete</span>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    
  );
}