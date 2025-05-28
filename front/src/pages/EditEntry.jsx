import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const EditEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', visibility: 'PUBLIC' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/entries/${id}`);
        const { title, content, visibility } = res.data.data;
        setFormData({ title, content, visibility });
      } catch (err) {
        console.error('Error fetching entry:', err);
        setError('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await api.put(`/entries/${id}`, formData);
      navigate(`/entries/${id}`);
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      
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
          <p className="text-lg text-gray-600">Loading entry for editing...</p>
        </section>
      
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

  return (
    
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link 
            to="/dashboard" 
            className="text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md px-2 py-1"
          >
            ← Return to Dashboard
          </Link>
        </nav>
        
        {/* Main content */}
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Entry</h1>
            <p className="mt-2 text-lg text-gray-600">Update your entry details below</p>
          </header>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Title field */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out"
                placeholder="Enter entry title"
                autoComplete="off"
              />
            </div>
            
            {/* Content field */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows="10"
                required
                value={formData.content}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out resize-vertical"
                placeholder="Write your entry content here..."
              />
            </div>
            
            {/* Visibility field */}
            <div className="mb-8">
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out"
                aria-describedby="visibility-description"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
              <p id="visibility-description" className="mt-1 text-sm text-gray-500">
                Choose who can view this entry
              </p>
            </div>
            
            {/* Form actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {submitting ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              <Link
                to={`/entries/${id}`}
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    
  );
};

export default EditEntry;