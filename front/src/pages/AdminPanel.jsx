import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, deleteUser, getEntries, deleteEntry } from '../utils/api';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await getAllUsers();
      setUsers(usersResponse.data.data);
      
      // Fetch ALL entries (admin has access to all)
      const entriesResponse = await getEntries();
      console.log("Admin entries response:", entriesResponse.data);
    console.log("Number of entries:", entriesResponse.data.data.length);
    console.log("Entry visibilities:", entriesResponse.data.data.map(e => e.visibility));
    setEntries(entriesResponse.data.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };
  
  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(entryId);
        setEntries(entries.filter(entry => entry.id !== entryId));
      } catch (err) {
        setError('Failed to delete entry');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading data...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
        
        <div className="flex space-x-4">
          <Link 
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
          
          <Link 
            to="/entries/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Entry
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Users Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Users</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage all users in the system</p>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">{user.name || 'No name'}</p>
                    <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{user.email}</span>
                    <span className="ml-4">Entries: {user._count?.entries || 0}</span>
                  </div>
                </div>
                <div>
                  {user.id !== currentUser.uid && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
          {users.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">
              No users found
            </li>
          )}
        </ul>
      </div>
      
      {/* All Entries Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">All Entries</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View and manage all entries in the system (including private)</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/entries/${entry.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {entry.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{entry.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.visibility === 'PRIVATE' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/entries/${entry.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      {entry.userId === currentUser.uid && (
                        <Link
                          to={`/entries/edit/${entry.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}