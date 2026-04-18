import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const token = await firebaseUser.getIdToken();
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/jwt`, 
            { email: firebaseUser.email },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.setItem('token', response.data.token);
          setDbUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setDbUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/jwt`, 
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('token', response.data.token);
      setDbUser(response.data.user);
      return result.user;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/jwt`, 
        { email: result.user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('token', response.data.token);
      setDbUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 404) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
          name: result.user.displayName || 'Google User',
          email: result.user.email,
          avatar: result.user.photoURL || '',
          bloodGroup: '',
          district: '',
          upazila: ''
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const retryResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/jwt`, 
          { email: result.user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.setItem('token', retryResponse.data.token);
        setDbUser(retryResponse.data.user);
      }
    }
    return result.user;
  };

const register = async (name, email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name,
        email,
        ...userData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      localStorage.setItem('token', response.data.token);
      setDbUser(response.data.user);
      return result.user;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    setDbUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
