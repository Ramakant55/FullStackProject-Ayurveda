import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data and token on initial load
    const userProfile = localStorage.getItem('userProfile');
    const token = localStorage.getItem('token');
    
    if (userProfile && token) {
      try {
        setUser(JSON.parse(userProfile));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // If there's an error parsing user data, clear it
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    // Store both the user data and token in localStorage
    localStorage.setItem('userProfile', JSON.stringify(userData));
    localStorage.setItem('token', token);
    // Dispatch userLogin event for navbar and other components to update
    window.dispatchEvent(new Event('userLogin'));
  };

  const logout = () => {
    setUser(null);
    // Clear both user data and token from localStorage
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear any old format data as well
  };

  const value = {
    user,
    login,
    logout,
    loading,
    // Add a getter for token to make it accessible throughout the app
    getToken: () => localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};