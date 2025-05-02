import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, deleteUser } from '../utils/api';
import { Link } from 'react-router-dom'; // Make sure Link is imported

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users');
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

  if (loading) return <div className="text-center p-8">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
        
        {/* Add navigation buttons here */}
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
            onClick={() => console.log("Create entry button clicked")}
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
    </div>
  );
}