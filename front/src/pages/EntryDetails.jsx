import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEntry, deleteEntry } from '../utils/api';

export default function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const isAdmin = userData?.role === 'ADMIN';
  
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await getEntry(id);
        setEntry(response.data.data);
      } catch (err) {
        console.error('Failed to fetch entry', err);
        setError('Failed to load this entry. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntry();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${entry?.title}"? This action cannot be undone.`)) {
      try {
        await deleteEntry(id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete entry', err);
        setError('Failed to delete the entry. Please try again.');
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
          <p className="text-lg text-gray-600">Loading entry...</p>
        </section>
      </main>
    );
  }
  
  // Error state
  if (error) {
    return (
      
        <section className="text-center max-w-md mx-auto p-8">
          <svg 
            className="mx-auto h-12 w-12 text-red-500 mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Entry</h1>
          <p role="alert" className="text-red-600 mb-4">{error}</p>
          <Link 
            to="/dashboard"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </Link>
        </section>
     
    );
  }
  
  // Entry not found
  if (!entry) {
    return (
      
        <section className="text-center max-w-md mx-auto p-8">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Entry Not Found</h1>
          <p className="text-gray-600 mb-4">The entry you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/dashboard"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </Link>
        </section>
      
    );
  }
  
  const isOwner = currentUser && entry.userId === currentUser.uid;
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;
  
  return (
    
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md px-2 py-1"
          >
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </nav>

        {/* Main content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Entry header */}
          <header className="px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {entry.title}
              </h1>

              {/* Admin badge */}
              {isAdmin && !isOwner && (
                <span
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-md"
                  role="status"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Admin View
                </span>
              )}
            </div>

            {/* Entry metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>By {entry.user?.name || "Unknown"}</span>
              </div>

              <time
                dateTime={entry.createdAt}
                className="flex items-center"
                title={`Created on ${new Date(
                  entry.createdAt
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(entry.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  entry.visibility === "PRIVATE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    entry.visibility === "PRIVATE"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                ></span>
                {entry.visibility === "PRIVATE" ? "Private" : "Public"}
              </span>
            </div>
          </header>

          {/* Entry image */}
          {entry.imageUrl && (
            <figure className="mb-8">
              <img
                src={entry.imageUrl}
                alt={`Image for entry: ${entry.title}`}
                className="w-full max-h-96 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  console.error("Failed to load image:", entry.imageUrl);
                }}
              />
            </figure>
          )}

          {/* Entry content */}
          <section
            className="px-6 pb-8 sm:px-8"
            aria-labelledby="entry-content"
          >
            <h2 id="entry-content" className="sr-only">
              Entry Content
            </h2>
            <div className="prose prose-lg max-w-none">
              {entry.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                  {paragraph || "\u00A0"}
                </p>
              ))}
            </div>
          </section>

          {/* Action buttons */}
          {(canEdit || canDelete) && (
            <footer className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                {canEdit && (
                  <Link
                    to={`/entries/${entry.id}/edit`} // ✅ Cambiar a esto
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    aria-label={`Edit entry: ${entry.title}`}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Entry
                  </Link>
                )}

                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    aria-label={`Delete entry: ${entry.title}`}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Entry
                  </button>
                )}
              </div>
            </footer>
          )}
        </article>
      </div>
    
  );
}