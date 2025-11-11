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
      // Simulate API call with admin/user detection
      const response = await new Promise((resolve, reject) => 
        setTimeout(() => {
          if (email && password) {
            // Admin credentials - FIXED
            if (email === 'admin@talenthub.com' && password === 'admin@123') {
              resolve({
                data: {
                  token: 'mock-admin-jwt-token',
                  user: {
                    id: 1,
                    email: 'admin@talenthub.com',
                    name: 'Admin',
                    role: 'admin',
                    company: 'TalentHub Admin',
                    avatar: '/avatars/admin.png',
                    permissions: ['all']
                  }
                }
              });
            }
            // Demo user credentials
            else if (email === 'user@talenthub.com' && password === 'user123') {
              resolve({
                data: {
                  token: 'mock-user-jwt-token',
                  user: {
                    id: 2,
                    email: 'user@talenthub.com',
                    name: 'Demo User',
                    role: 'user',
                    company: 'Example Corp',
                    avatar: '/avatars/user.png',
                    permissions: ['read', 'write']
                  }
                }
              });
            }
            // Regular user registration simulation
            else if (email.includes('@') && password.length >= 6) {
              resolve({
                data: {
                  token: 'mock-jwt-token',
                  user: {
                    id: Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    role: 'user',
                    company: 'User Company',
                    avatar: '/avatars/default.png',
                    permissions: ['read', 'write']
                  }
                }
              });
            } else {
              reject(new Error('Invalid credentials'));
            }
          } else {
            reject(new Error('Email and password are required'));
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
      // Simulate API call - Always create regular users
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
                  role: 'user', // Default role for new registrations
                  company: userData.companyName || 'Unknown Company',
                  avatar: '/avatars/default.png',
                  permissions: ['read', 'write']
                }
              }
            });
          } else {
            reject(new Error('Registration failed - all fields are required'));
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

  // Helper methods for role-based access
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const value = {
    user,
    login,
    register,
    resetPassword,
    logout,
    loading,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};