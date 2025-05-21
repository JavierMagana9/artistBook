import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api, { getUserProfile } from '../utils/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Get and set token
          const token = await user.getIdToken();
          console.log("Got token of length:", token.length);
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user profile from backend
          try {
            const res = await getUserProfile();
            setUserData(res.data.data);
            console.log("User data fetched:", res.data.data);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            setUserData(null);
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setUserData(null);
        }
      } else {
        // User signed out
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    isAdmin: userData?.role === 'ADMIN',
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};