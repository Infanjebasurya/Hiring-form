// src/Admin/Layout/AdminLayout.jsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Logout,
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const AdminLayout = ({ children, darkMode, onToggleTheme, onLogout, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Dashboard />, path: '/admin' },
    { text: 'Users', icon: <People />, path: '/admin/users' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const drawer = (
    <Box sx={{ 
      background: theme.palette.background.paper, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo/Sidebar Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px'
      }}>
        {!collapsed && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Admin Panel
          </Typography>
        )}
        <IconButton 
          onClick={toggleCollapse}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text} 
            title={collapsed ? item.text : ''} 
            placement="right"
            disableHoverListener={!collapsed}
          >
            <ListItem
              button
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 2 : 3,
                backgroundColor: location.pathname === item.path ? 
                  theme.palette.primary.main + '20' : 'transparent',
                border: location.pathname === item.path ? 
                  `1px solid ${theme.palette.primary.main}30` : '1px solid transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  border: `1px solid ${theme.palette.primary.main}20`
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 
                  theme.palette.primary.main : theme.palette.text.secondary,
                minWidth: collapsed ? 'auto' : '56px',
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              <Collapse in={!collapsed} orientation="horizontal">
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path ? 
                        theme.palette.primary.main : theme.palette.text.primary
                    }
                  }}
                />
              </Collapse>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* User Info at Bottom */}
      {!collapsed && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {user?.email || 'admin@example.com'}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Admin Panel'}
          </Typography>

          {/* Theme Toggle */}
          <IconButton 
            onClick={onToggleTheme} 
            color="inherit"
            sx={{ mr: 1 }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Logout */}
          <IconButton onClick={onLogout} color="inherit">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: theme.palette.background.paper
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;