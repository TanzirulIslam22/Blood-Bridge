import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import axios from 'axios';

const AuthContext = createContext();

const API = import.meta.env.VITE_API_BASE_URL;

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const displayName = (firebaseUser, fallbackEmail) =>
  firebaseUser.displayName || fallbackEmail.split('@')[0] || 'User';

const registerDbUser = (firebaseUser, token, extra = {}) =>
  axios.post(`${API}/api/auth/register`, {
    name: displayName(firebaseUser, firebaseUser.email),
    email: firebaseUser.email,
    avatar: firebaseUser.photoURL || '',
    bloodGroup: '',
    district: '',
    upazila: '',
    ...extra
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

const requestJwt = (email, token) =>
  axios.post(`${API}/api/auth/jwt`,
    { email: normalizeEmail(email) },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRegisteringRef = useRef(false);

  const syncDbUser = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken();
    let response;

    try {
      response = await requestJwt(firebaseUser.email, token);
    } catch (error) {
      if (error.response?.status === 404 && !isRegisteringRef.current) {
        await registerDbUser(firebaseUser, token);
        response = await requestJwt(firebaseUser.email, token);
      } else {
        throw error;
      }
    }

    localStorage.setItem('token', response.data.token);
    setDbUser(response.data.user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await syncDbUser(firebaseUser);
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
      await syncDbUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await syncDbUser(result.user);
    return result.user;
  };

  const register = async (name, email, password, userData) => {
    try {
      isRegisteringRef.current = true;
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const token = await result.user.getIdToken();
      let response;
      try {
        response = await axios.post(`${API}/api/auth/register`, {
          name,
          email: normalizeEmail(email),
          ...userData
        }, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
          response = await requestJwt(email, token);
        } else {
          throw error;
        }
      }
      localStorage.setItem('token', response.data.token);
      setDbUser(response.data.user);
      return result.user;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    } finally {
      isRegisteringRef.current = false;
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
