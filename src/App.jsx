// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import TopNav from './components/Layout/TopNav/TopNav';
import MainContent from './components/MainContent/MainContent';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Settings from './components/Layout/Settings/Settings';
import Home from './components/Layout/Home/Home';
import User from './components/Layout/User/User';
import HiringForm from './components/HiringForm/HiringForm';
import Plans from './components/Layout/Upgrade-Plan/plans';
import HelpUsImprove from './components/Layout/HelpUsImprove/HelpUsImprove';
import AdminLayout from './Admin/Layout/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';

// Theme configurations
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
      styleOverflows: {
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

// Admin theme with different colors
const getAdminTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#3498DB' : '#2980B9',
    },
    secondary: {
      main: mode === 'dark' ? '#2ECC71' : '#27AE60',
    },
    ...(mode === 'dark' ? {
      background: {
        default: '#0C0F1A',
        paper: '#1A2035',
      },
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    } : {
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#2C3E50',
        secondary: 'rgba(44, 62, 80, 0.6)',
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Main Layout Component with Top Navigation
function MainLayout({ 
  children, 
  darkMode, 
  isSidebarCollapsed, 
  onToggleTheme, 
  onToggleSidebar, 
  mobileOpen, 
  onMobileClose, 
  isMobile,
  onOpenFeedback 
}) {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar 
        darkMode={darkMode} 
        onToggleTheme={onToggleTheme}
        isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={onMobileClose}
        isMobile={isMobile}
      />
      
      {/* Main Content with Top Navigation */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default'
        }}
      >
        {/* Top Navigation Header */}
        <TopNav 
          darkMode={darkMode}
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
          onOpenFeedback={onOpenFeedback}
        />
        
        {/* Page Content */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Admin App Content
function AdminAppContent() {
  const [adminDarkMode, setAdminDarkMode] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminTheme = useMemo(() => getAdminTheme(adminDarkMode ? 'dark' : 'light'), [adminDarkMode]);

  const handleAdminToggleTheme = () => {
    setAdminDarkMode(!adminDarkMode);
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminLayout 
        darkMode={adminDarkMode} 
        onToggleTheme={handleAdminToggleTheme}
        onLogout={handleAdminLogout}
        user={user}
      >
        <AdminDashboard darkMode={adminDarkMode} />
      </AdminLayout>
    </ThemeProvider>
  );
}

// Main App Content - For regular users
function MainAppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Redirect admin users to admin panel
  useEffect(() => {
    if (user && isAdmin && !window.location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

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

  const handleOpenFeedback = () => {
    setFeedbackOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
  };

  // Common layout props
  const layoutProps = {
    darkMode,
    isSidebarCollapsed,
    onToggleTheme: handleToggleTheme,
    onToggleSidebar: handleToggleSidebar,
    mobileOpen,
    onMobileClose: handleMobileDrawerClose,
    isMobile,
    onOpenFeedback: handleOpenFeedback
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Help Us Improve Dialog */}
      <HelpUsImprove 
        open={feedbackOpen}
        onClose={handleCloseFeedback}
        darkMode={darkMode}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Login darkMode={darkMode} onToggleTheme={handleToggleTheme} />} 
        />
        <Route 
          path="/register" 
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <Register darkMode={darkMode} onToggleTheme={handleToggleTheme} />} 
        />
        <Route 
          path="/forgot-password" 
          element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />) : <ForgotPassword darkMode={darkMode} onToggleTheme={handleToggleTheme} />} 
        />
        
        {/* Protected Routes - Regular User Only */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Home darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <User darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/hiring-form" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <HiringForm darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Plans Route */}
        <Route 
          path="/plans" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Plans darkMode={darkMode} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat/new" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/search" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/upgrade" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <MainContent 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requireUser={true}>
              <MainLayout {...layoutProps}>
                <Settings 
                  darkMode={darkMode} 
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route for regular users */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes - All admin routes under /admin/* */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminAppContent />
              </AdminRoute>
            } 
          />
          
          {/* Main App Routes */}
          <Route path="*" element={<MainAppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;