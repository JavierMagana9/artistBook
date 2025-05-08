import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const EntryDetail = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await api.get(`/entries/${id}`);
        setEntry(response.data.data);
      } catch (error) {
        console.error('Error getting entry', error);
        setError('It could not be loaded. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) return <div className="flex justify-center p-8">Loading entry...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!entry) return <div className="p-8">Entry not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
      
      <div className="mb-4 text-sm text-gray-600">
        <span className="mr-3">
          {new Date(entry.createdAt).toLocaleDateString()}
        </span>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {entry.visibility}
        </span>
      </div>
      
      {entry.imageUrl && (
        <div className="mb-6">
          <img 
            src={entry.imageUrl} 
            alt={entry.title} 
            className="w-full h-auto rounded-lg object-cover max-h-96"
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{entry.content}</p>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Link 
          to={`/edit-entry/${entry.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edita entry
        </Link>
      </div>
    </div>
  );
};

export default EntryDetail;