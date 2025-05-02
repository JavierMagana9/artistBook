import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getUserEntries } from '../utils/api';

export default function Dashboard() {
  const { currentUser, logout, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          // Fetch user profile
          const userResponse = await getUserProfile();
          setUserData(userResponse.data.data);
          
          // Fetch only the user's own entries
          const userEntriesResponse = await getUserEntries();
          console.log("User entries:", userEntriesResponse.data);
          setEntries(userEntriesResponse.data.data);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
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
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Entries</h2>
          <Link
            to="/entries/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create New Entry
          </Link>
        </div>
        
        {/* <div>
          <h3 className="font-medium mb-2">DEBUG INFO:</h3>
          <p>Total entries: {entries.length}</p>
          <p>User ID: {userData?.id}</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(entries, null, 2)}
          </pre>
        </div>*/}
        
        {entries.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No entries found</p>
        ) : (
          <ul className="divide-y">
            {entries.map(entry => (
              <li key={entry.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{entry.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {entry.content.substring(0, 50)}
                      {entry.content.length > 50 ? '...' : ''}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.visibility === 'PRIVATE' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.visibility}
                    </span>
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