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
        console.error(err);
        setError('Failed to load entries');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await api.delete(`/entries/${entryId}`);
        // Actualizar la lista de entradas
        setEntries(entries.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error al eliminar la entrada:', error);
        setError('No se pudo eliminar la entrada.');
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading entries...</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Entries</h1>
        <Link
          to="/entries/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Entry
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No entries yet. Create your first one!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {entries.map(entry => (
              <li key={entry.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">{entry.title}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-2">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {entry.visibility}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {entry.userId === currentUser.uid && (
                        <>
                          <Link
                            to={`/entries/${entry.id}/edit`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <Link
                        to={`/entries/${entry.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}