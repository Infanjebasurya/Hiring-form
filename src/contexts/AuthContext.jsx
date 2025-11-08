// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Fix: Check if userData exists and is valid JSON
    if (token && userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => 
        setTimeout(() => {
          if (email && password) {
            resolve({
              data: {
                token: 'mock-jwt-token',
                user: {
                  id: 1,
                  email,
                  name: 'User', // Added default name
                  company: 'Example Corp'
                }
              }
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000)
      );

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => 
        setTimeout(() => {
          if (userData.email && userData.password && userData.name) {
            resolve({
              data: {
                token: 'mock-jwt-token',
                user: {
                  id: Date.now(),
                  email: userData.email,
                  name: userData.name,
                  company: userData.companyName || 'Unknown Company'
                }
              }
            });
          } else {
            reject(new Error('Registration failed'));
          }
        }, 1000)
      );

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const resetPassword = async (email) => {
    try {
      // Simulate API call for password reset
      const response = await new Promise((resolve, reject) => 
        setTimeout(() => {
          if (email) {
            resolve({
              data: {
                success: true,
                message: 'Password reset instructions sent to your email'
              }
            });
          } else {
            reject(new Error('Email is required'));
          }
        }, 1500)
      );

      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    resetPassword,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};