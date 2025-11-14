// src/components/Layout/TopNav/TopNav.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const TopNav = ({ darkMode, user, isSidebarCollapsed, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/user') return 'User Management';
    if (path === '/hiring-form') return 'Hiring Form';
    if (path === '/chat' || path === '/chat/new') return 'Chat';
    if (path === '/search') return 'Search';
    if (path === '/plans') return 'Upgrade Plan';
    if (path === '/settings') return 'Settings';
    
    return 'Dashboard';
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    navigate('/user');
    handleProfileMenuClose();
  };

  const pageTitle = getPageTitle();

  return (
    <Box 
      sx={{
        width: '100%',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          height: { xs: 56, md: 64 }, // Smaller height on mobile (56px), normal on desktop (64px)
          width: '100%',
          // Fixed width calculation for desktop ONLY
          '@media (min-width: 769px)': {
            width: isSidebarCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 280px)',
            marginLeft: 'auto'
          },
          // Mobile view: always full width
          '@media (max-width: 768px)': {
            width: '100vw',
            marginLeft: 0
          }
        }}
      >
        <Toolbar sx={{ 
          justifyContent: { xs: 'center', md: 'space-between' }, // Center on mobile, space-between on desktop
          px: { xs: 2, md: 3 },
          minHeight: { xs: '56px !important', md: '64px !important' }, // Match the AppBar height
          width: '100%',
          position: 'relative',
          // Ensure full width on mobile
          '@media (max-width: 768px)': {
            width: '100%',
            maxWidth: '100vw',
            margin: 0,
            padding: '0 16px'
          }
        }}>
          {/* Page Title - Centered on mobile, left-aligned on desktop */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // Center on mobile, auto margin on desktop
              textAlign: { xs: 'center', md: 'left' },
              width: { xs: 'calc(100% - 80px)', md: 'auto' }, // Account for profile icon space on mobile
              position: { xs: 'absolute', md: 'static' }, // Absolute positioning for mobile centering
              left: { xs: '50%', md: 'auto' },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              // Ensure proper width on mobile
              '@media (max-width: 768px)': {
                maxWidth: 'calc(100vw - 80px)' // Prevent overflow on small screens
              }
            }}
          >
            {pageTitle}
          </Typography>

          {/* Right Section - Notifications and Profile (Hidden on mobile, shown on desktop) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
            alignItems: 'center', 
            gap: 1,
            flexShrink: 0,
            ml: 'auto'
          }}>
            {/* Notifications */}
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            {/* Profile Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>

            {/* Notifications Menu Dropdown */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 320,
                  maxHeight: 400,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New message from John" secondary="2 minutes ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="Interview scheduled" secondary="1 hour ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New user registered" secondary="2 hours ago" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Profile Icon (Right side on mobile) */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            {/* Profile Menu Dropdown for Mobile */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              {/* Notifications for Mobile */}
              <MenuItem onClick={handleNotificationMenuOpen}>
                <ListItemIcon>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                <ListItemText>Notifications</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>

            {/* Notifications Menu Dropdown for Mobile */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 280,
                  maxHeight: 400,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                  }
                }
              }}
            >
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New message from John" secondary="2 minutes ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="Interview scheduled" secondary="1 hour ago" />
              </MenuItem>
              <MenuItem onClick={handleNotificationMenuClose}>
                <ListItemText primary="New user registered" secondary="2 hours ago" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopNav;