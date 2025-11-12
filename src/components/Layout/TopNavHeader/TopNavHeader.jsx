// src/components/Layout/TopNavHeader/TopNavHeader.jsx
import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const TopNavHeader = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
        return 'Home';
      case '/user':
        return 'User Management';
      case '/hiring-form':
        return 'Hiring Form';
      case '/chat':
      case '/chat/new':
        return 'Chat';
      case '/search':
        return 'Search';
      case '/upgrade':
        return 'Upgrade Plan';
      case '/settings':
        return 'Settings';
      default:
        if (path.startsWith('/admin')) {
          return 'Admin Dashboard';
        }
        return 'Page';
    }
  };

  // Get breadcrumb items based on current route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const items = [
      <Link
        key="home"
        underline="hover"
        color="inherit"
        href="/"
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
        Home
      </Link>
    ];

    if (path === '/user') {
      items.push(
        <Typography key="users" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          User Management
        </Typography>
      );
    } else if (path === '/hiring-form') {
      items.push(
        <Typography key="hiring-form" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Hiring Form
        </Typography>
      );
    } else if (path === '/settings') {
      items.push(
        <Typography key="settings" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Settings
        </Typography>
      );
    } else if (path.startsWith('/admin')) {
      items.push(
        <Typography key="admin" color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Admin
        </Typography>
      );
    }

    return items;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: darkMode ? 'background.paper' : 'background.default',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        px: isMobile ? 2 : 3,
        py: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '100%'
      }}>
        {/* Page Title */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          {getPageTitle()}
        </Typography>

        {/* Breadcrumbs - Hide on mobile for simplicity */}
        {!isMobile && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': {
                color: theme.palette.text.secondary
              }
            }}
          >
            {getBreadcrumbs()}
          </Breadcrumbs>
        )}
      </Box>
    </Box>
  );
};

export default TopNavHeader;