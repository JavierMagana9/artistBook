import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api, { getUserProfile } from '../utils/api';

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const buildFallbackUserData = (user) => ({
  id: user.uid,
  email: user.email,
  name: user.displayName || user.email?.split('@')[0] || 'Artist',
  role: 'USER',
  isFallback: true
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setProfileError(null);
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setProfileError(null);

      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          try {
            const res = await getUserProfile();
            const backendUserData = res.data.data;
            setUserData(backendUserData);
            localStorage.setItem('userId', backendUserData.id);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            setUserData(buildFallbackUserData(user));
            setProfileError(profileError);
            localStorage.removeItem('userId');
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setUserData(buildFallbackUserData(user));
          setProfileError(err);
          localStorage.removeItem('userId');
        }
      } else {
        // User signed out
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        delete api.defaults.headers.common['Authorization'];
        setUserData(null);
        setProfileError(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    profileError,
    isAdmin: userData?.role === 'ADMIN' && !userData?.isFallback,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
