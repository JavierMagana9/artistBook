import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEntry, getEntry, updateEntry } from '../utils/api';

export default function EntryForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    visibility: 'PRIVATE'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Fetch entry data if in edit mode
  useEffect(() => {
    const fetchEntry = async () => {
      if (isEditMode && token) {
        try {
          const response = await getEntry(id);
          const entry = response.data.data;
          setFormData({
            title: entry.title,
            content: entry.content,
            imageUrl: entry.imageUrl || '',
            visibility: entry.visibility
          });
        } catch (err) {
          console.error('Failed to fetch entry:', err);
          setError('Failed to load entry data. It may have been deleted or you may not have permission to edit it.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchEntry();
  }, [id, isEditMode, token]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear success message when user starts editing
    if (success) setSuccess(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (isEditMode) {
        await updateEntry(id, formData);
      } else {
        await createEntry(formData);
      }
      setSuccess(true);
      // Redirect after showing success message
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Failed to save entry:', err);
      setError('Failed to save your entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state for edit mode
  if (loading && isEditMode) {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </nav>
        
        {/* Main content */}
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Entry' : 'Create New Entry'}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {isEditMode 
                ? 'Update your entry details below' 
                : 'Share your creativity with the world'
              }
            </p>
          </header>
          
          {/* Error message */}
          {error && (
            <div role="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <svg 
                  className="w-5 h-5 mr-2 mt-0.5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div role="status" className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <svg 
                  className="w-5 h-5 mr-2 mt-0.5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Entry {isEditMode ? 'updated' : 'created'} successfully! Redirecting to dashboard...</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Title field */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out"
                placeholder="Enter your entry title"
                autoComplete="off"
              />
            </div>
            
            {/* Content field */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500" aria-label="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows="10"
                value={formData.content}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out resize-vertical"
                placeholder="Express your creativity here..."
              />
            </div>
            
            {/* Image URL field */}
            <div className="mb-6">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-70 transition duration-150 ease-in-out"
                placeholder="https://example.com/image.jpg"
                aria-describedby="image-description"
              />
              <p id="image-description" className="mt-1 text-sm text-gray-500">
                Add an image URL to enhance your entry
              </p>
              
              {/* Image preview */}
              {formData.imageUrl && (
                <figure className="mt-3">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview of your entry image"
                    className="max-h-48 w-auto object-cover rounded-md border border-gray-200" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error('Failed to load preview image');
                    }}
                  />
                </figure>
              )}
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
                <option value="PRIVATE">Private - Only visible to you</option>
                <option value="PUBLIC">Public - Visible to everyone</option>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-4 h-4 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isEditMode ? 'Update Entry' : 'Create Entry'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    
  );
}