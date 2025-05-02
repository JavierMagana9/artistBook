import { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import { getUserProfile } from '../utils/api';
import { setAuthToken } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Sign up function
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  };

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Get current user's token
  const getToken = async () => {
    if (currentUser) {
      const token = await currentUser.getIdToken();
      setToken(token);
      return token;
    }
    return null;
  };

  // Fetch user data function
  const fetchUserData = async () => {
    if (token) {
      try {
        // Set the token before making the API call
        setAuthToken(token);
        const response = await getUserProfile();
        setUserData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
        // Don't set userData if there's an error
      }
    }
  };

  // Listen for auth state changes
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user?.email);
      setCurrentUser(user);
      
      if (user) {
        try {
          const newToken = await user.getIdToken();
          console.log("Got token of length:", newToken.length);
          setToken(newToken);
          setAuthToken(newToken);
        } catch (err) {
          console.error("Error getting token:", err);
        }
      } else {
        setToken(null);
        setUserData(null);
        setAuthToken(null);
      }
      
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);
  // Separate effect to fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const value = {
    currentUser,
    userData,
    token,
    loading,
    signup,
    login,
    logout,
    getToken,
    fetchUserData // Expose this to allow manual refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}