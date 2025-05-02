import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEntry, deleteEntry } from '../utils/api';

export default function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
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
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await deleteEntry(id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete entry', err);
        setError('Failed to delete the entry. Please try again.');
      }
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading entry...</div>;
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          Entry not found.
        </div>
        <div className="mt-4">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const isOwner = currentUser && entry.userId === currentUser.uid;
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{entry.title}</h1>
        <div className="flex space-x-2">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            &larr; Back
          </Link>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div>
          By {entry.user?.name || 'Unknown'}
        </div>
        <div className="flex items-center space-x-4">
          <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
            {entry.visibility}
          </span>
        </div>
      </div>
      
      {entry.imageUrl && (
        <div className="mb-6">
          <img 
            src={entry.imageUrl} 
            alt={entry.title} 
            className="w-full max-h-96 object-cover rounded-lg" 
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        {entry.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      {isOwner && (
        <div className="mt-8 flex space-x-4">
          <Link 
            to={`/entries/edit/${entry.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Entry
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Entry
          </button>
        </div>
      )}
    </div>
  );
}