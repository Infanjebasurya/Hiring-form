import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366F1',
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
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Check if device is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  // Auto-collapse sidebar on mobile
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
    </ThemeProvider>
  );
}

export default App;