// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#6366F1' : '#667eea',
    },
    secondary: {
      main: mode === 'dark' ? '#818cf8' : '#5568d3',
    },
    ...(mode === 'dark' ? {
      background: {
        default: '#0F0F0F',
        paper: '#1A1A1A',
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    } : {
      background: {
        default: '#FFFFFF',
        paper: '#F8FAFC',
      },
      text: {
        primary: '#1A1A1A',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#6366F1' : '#667eea',
            },
          },
        },
      },
    },
  },
});

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login darkMode={darkMode} onToggleTheme={handleToggleTheme} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register darkMode={darkMode} onToggleTheme={handleToggleTheme} />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Box sx={{ display: 'flex' }}>
                <Sidebar 
                  darkMode={darkMode} 
                  onToggleTheme={handleToggleTheme}
                  isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
                  onToggleSidebar={handleToggleSidebar}
                  mobileOpen={mobileOpen}
                  onMobileClose={handleMobileDrawerClose}
                  isMobile={isMobile}
                />
                
                <MainContent 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </Box>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;