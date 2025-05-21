import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { currentUser, userData, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
              Artist Book
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link to="/entries/new" className="text-gray-700 hover:text-indigo-600">
                New Entry
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-indigo-600">
                  Admin Panel
                </Link>
              )}
            </nav>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                {userData?.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}