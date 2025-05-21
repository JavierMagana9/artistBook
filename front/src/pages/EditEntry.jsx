import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const EditEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', visibility: 'PUBLIC' });
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/entries/${id}`);
        const { title, content, visibility } = res.data.data;
        setFormData({ title, content, visibility });
      } catch (err) {
        console.error(err);
        setError('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/entries/${id}`, formData);
      navigate(`/entries/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update entry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading entry for editing...</div>;
  if (error)   return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Edit entry</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="8"
            required
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PUBLIC">Pública</option>
            <option value="PRIVATE">Privada</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link
            to={`/entries/${id}`}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditEntry;