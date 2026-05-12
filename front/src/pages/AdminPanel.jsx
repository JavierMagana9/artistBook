import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData } = useAuth();
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, entriesResponse] = await Promise.all([
          api.get('/users'),
          api.get('/entries')
        ]);
        setUsers(usersResponse.data.data);
        setEntries(entriesResponse.data.data);
      } catch (err) {
        setError('Failed to load admin data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  const handleToggleRole = async (user) => {
    try {
      // Don't allow changing current user's role
      if (user.id === userData.id) {
        alert("You cannot change your own role.");
        return;
      }
      
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      const confirmed = window.confirm(
        `Are you sure you want to change ${user.email}'s role from ${user.role} to ${newRole}?`
      );
      
      if (confirmed) {
        await api.put(`/users/${user.id}`, {
          role: newRole
        });
        
        // Update users list
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, role: newRole } : u
        ));
        
        alert(`User role updated successfully to ${newRole}`);
      }
    } catch (err) {
      alert('Failed to change user role: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user ${userName || userId}?`)) {
      return;
    }
    
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Function to delete an entry
  const handleDeleteEntry = async (entryId, entryTitle) => {
    if (!window.confirm(`Are you sure you want to delete entry "${entryTitle}"?`)) {
      return;
    }
    
    try {
      await api.delete(`/entries/${entryId}`);
      setEntries(entries.filter(entry => entry.id !== entryId));
      alert('Entry deleted successfully');
    } catch (err) {
      alert('Failed to delete entry: ' + (err.response?.data?.message || err.message));
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
          <p className="text-lg text-gray-600">Loading admin panel...</p>
        </section>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
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
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel Error</h1>
          <p role="alert" className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header - Mobile optimized */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">Manage users and entries</p>
        </header>
        
        {/* Users Section - Mobile responsive tables */}
        <section className="mb-8 sm:mb-10" aria-labelledby="users-section">
          <h2 id="users-section" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Users Management</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Users management table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || '(No name)'}
                        </div>
                        {/* Show email on mobile under name */}
                        <div className="text-xs text-gray-500 sm:hidden">
                          {user.email}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <time dateTime={user.createdAt}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </time>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                          {/* Role toggle button */}
                          <button
                            onClick={() => handleToggleRole(user)}
                            className={`text-xs px-2 py-1 rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              user.id === userData.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : user.role === 'ADMIN'
                                  ? 'text-yellow-600 hover:text-yellow-900 focus:ring-yellow-500'
                                  : 'text-green-600 hover:text-green-900 focus:ring-green-500'
                            }`}
                            disabled={user.id === userData.id}
                            aria-label={`Change ${user.email}'s role from ${user.role} to ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
                          >
                            {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                          </button>
                          
                          {/* Delete user button */}
                          {user.id !== userData.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                              className="text-xs px-2 py-1 rounded text-red-600 hover:text-red-900 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              aria-label={`Delete user ${user.email}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Entries Section - Similar mobile treatment */}
        <section aria-labelledby="entries-section">
          <h2 id="entries-section" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Entries Management</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Entries management table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visibility
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map(entry => (
                    <tr key={entry.id}>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {entry.title}
                        </div>
                        {/* Show author and visibility on mobile under title */}
                        <div className="text-xs text-gray-500 sm:hidden space-y-1">
                          <div>By: {users.find(u => u.id === entry.userId)?.email || entry.userId}</div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            entry.visibility === 'PUBLIC' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.visibility}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {users.find(u => u.id === entry.userId)?.email || entry.userId}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.visibility === 'PUBLIC' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.visibility}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <time dateTime={entry.createdAt}>
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </time>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <Link
                            to={`/entries/${entry.id}`}
                            className="text-xs px-2 py-1 rounded text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            aria-label={`View entry: ${entry.title}`}
                          >
                            View
                          </Link>
                          <Link
                            to={`/entries/${entry.id}/edit`}
                            className="text-xs px-2 py-1 rounded text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label={`Edit entry: ${entry.title}`}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteEntry(entry.id, entry.title)}
                            className="text-xs px-2 py-1 rounded text-red-600 hover:text-red-900 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-label={`Delete entry: ${entry.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    
  );
}