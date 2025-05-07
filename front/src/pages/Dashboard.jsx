import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getUserEntries } from '../utils/api';

export default function Dashboard() {
  const { currentUser, logout, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [myEntries, setMyEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Determine if user is admin
  const isAdmin = userData?.role === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          // Fetch user profile
          const userResponse = await getUserProfile();
          setUserData(userResponse.data.data);
          
          // Fetch user's own entries
          const userEntriesResponse = await getUserEntries();
          console.log("My entries:", userEntriesResponse.data);
          setMyEntries(userEntriesResponse.data.data);
        } catch (err) {
          setError('Failed to fetch data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [token]);

  useEffect(() => {
    // Probar si podemos obtener el perfil del usuario (otra ruta autenticada)
    const testAuth = async () => {
      try {
        const token = await currentUser?.getIdToken(true);
        console.log('Token fresco obtenido:', token ? 'Sí' : 'No');
        
        const profileResponse = await getUserProfile();
        console.log('Perfil obtenido correctamente:', profileResponse.data);
      } catch (error) {
        console.error('Error probando autenticación:', error.message);
      }
    };
    
    if (currentUser) {
      testAuth();
    }
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  }

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User profile section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        
        {error && <div className="bg-red-100 p-4 mb-4 text-red-700 rounded">{error}</div>}
        
        {userData ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
            <p><strong>Name:</strong> {userData.name || 'Not set'}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>

            {isAdmin && (
              <div className="mt-6">
                <Link
                  to="/admin"
                  className="bg-purple-600 text-white px-4 py-2 rounded inline-block"
                >
                  Go to Admin Panel
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  As an admin, you can manage all users and entries in the admin panel.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
      
      {/* My entries section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Entries</h2>
          <Link
            to="/entries/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create New Entry
          </Link>
        </div>
        
        {isAdmin && (
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-blue-700">
              As an admin, you can view and manage all entries (including private entries from other users) in the 
              <Link to="/admin" className="font-medium underline mx-1">Admin Panel</Link>.
            </p>
          </div>
        )}
        
        {myEntries.length === 0 ? (
          <p className="text-center py-4 text-gray-500">You haven't created any entries yet.</p>
        ) : (
          <div className="space-y-4">
            {myEntries.map(entry => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-3 md:mb-0">
                    <Link 
                      to={`/entries/${entry.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {entry.title}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {entry.content.substring(0, 100)}
                      {entry.content.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 mr-2">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.visibility === 'PRIVATE' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.visibility}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/entries/edit/${entry.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/entries/${entry.id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}