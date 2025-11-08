// src/components/Layout/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Divider,
  IconButton,
  Tooltip,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
  MenuItem,  
  Typography
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SidebarHeader from './SidebarHeader';
import MenuSection from './MenuSection';
import ProgressBar from '../../Common/ProgressBar';
import UpgradeButton from './UpgradeButton';
import { sidebarMenu, planData } from '../../../data/sidebarData';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  darkMode, 
  onToggleTheme, 
  isSidebarCollapsed, 
  onToggleSidebar, 
  mobileOpen, 
  onMobileClose,
  isMobile 
}) => {
  const [openSections, setOpenSections] = useState({
    2: false, // Avatars - default closed
    3: false  // Projects - default closed
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNewChat = () => {
    console.log('New chat clicked');
    if (isMobile) onMobileClose();
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
  };

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    if (isMobile) onMobileClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) onMobileClose();
  };

  const handleToggleSidebarClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    if (isMobile) onMobileClose();
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <SidebarHeader
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
      />

      <Box sx={{
        overflow: 'auto',
        flex: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        margin: 0,
        gap: 2,
      }}>

        {/* New Chat Button with Search Icon */}
        <Box sx={{ 
          px: isMobile ? 2 : (isSidebarCollapsed ? 1 : 2), 
          mb: 0,
          margin: 0 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            margin: 0 
          }}>
            {/* New Chat Button */}
            {isMobile ? (
              <Box 
                onClick={handleNewChat}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                  color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AddIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                New Chat
              </Box>
            ) : isSidebarCollapsed ? (
              <Tooltip title="New Chat" placement="right">
                <IconButton
                  onClick={handleNewChat}
                  sx={{
                    width: '100%',
                    height: 44,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                    color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                    borderRadius: 2,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Box
                onClick={handleNewChat}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                  color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AddIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                New Chat
              </Box>
            )}

            {/* Search Icon */}
            {!isMobile && !isSidebarCollapsed && (
              <Tooltip title="Search">
                <IconButton
                  onClick={handleSearchClick}
                  sx={{
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                    borderRadius: 2,
                    width: 44,
                    height: 44,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Menu Sections */}
        <Box sx={{ 
          px: isMobile ? 1 : (isSidebarCollapsed ? 1 : 1), 
          flex: 1,
          width: '100%',
          margin: 0
        }}>
          {sidebarMenu.map((item) => (
            item.type === 'section' ? (
              <MenuSection
                key={item.id}
                section={item}
                isOpen={!!openSections[item.id]}
                onToggle={handleToggleSection}
                isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
              />
            ) : null
          ))}
        </Box>

        {/* Progress Bars and Bottom Section */}
        <Box sx={{ 
          px: isMobile ? 2 : (isSidebarCollapsed ? 1 : 2),
          mt: 'auto',
          width: '100%',
          margin: 0
        }}>
          {!isMobile && !isSidebarCollapsed && <Divider sx={{ my: 2, bgcolor: 'divider', margin: 0 }} />}
          
          {/* Free Plan Progress */}
          {!isMobile && !isSidebarCollapsed && (
            <ProgressBar
              used={planData.free.used}
              total={planData.free.total}
              label={planData.free.label}
              messages={planData.free.messages}
            />
          )}

          {/* Upgrade Plan Button */}
          {isMobile ? (
            <UpgradeButton onClick={handleUpgrade} />
          ) : isSidebarCollapsed ? (
            <Tooltip title="Upgrade Plan" placement="right">
              <IconButton
                onClick={handleUpgrade}
                sx={{
                  width: '100%',
                  height: 44,
                  mb: 1,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                  color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                  borderRadius: 2,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <BoltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <UpgradeButton onClick={handleUpgrade} />
          )}

          {/* Bottom Actions */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            mt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2,
            width: '100%',
            margin: 0
          }}>
            {/* Settings */}
            {isMobile ? (
              <MenuItem
                onClick={handleSettings}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            ) : isSidebarCollapsed ? (
              <Tooltip title="Settings" placement="right">
                <IconButton
                  onClick={handleSettings}
                  sx={{
                    color: 'text.secondary',
                    width: '100%',
                    height: 40,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <MenuItem
                onClick={handleSettings}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
            )}

            {/* Logout */}
            {isMobile ? (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'error.dark',
                    bgcolor: 'error.light'
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            ) : isSidebarCollapsed ? (
              <Tooltip title="Logout" placement="right">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    width: '100%',
                    height: 40,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'error.dark',
                      bgcolor: 'error.light'
                    }
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: 1,
                  minHeight: 40,
                  margin: 0,
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                    bgcolor: 'transparent',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                  },
                  '&:hover': {
                    color: 'error.dark',
                    bgcolor: 'error.light'
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            )}

            {/* Collapse/Expand Sidebar Icon - Now visible for both desktop and mobile */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 1,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              margin: 0,
              px: isMobile ? 1 : (isSidebarCollapsed ? 0 : 1),
            }}>
              <Tooltip title={isMobile ? "Close sidebar" : (isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}>
                <IconButton
                  onClick={handleToggleSidebarClick}
                  sx={{
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    width: 32,
                    height: 32,
                    margin: 0,
                    outline: 'none',
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    },
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.selected',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {isMobile ? (
                    <ChevronLeftIcon fontSize="small" />
                  ) : isSidebarCollapsed ? (
                    <ChevronRightIcon fontSize="small" />
                  ) : (
                    <ChevronLeftIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        <SwipeableDrawer
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              border: 'none',
              backgroundImage: 'none',
              overflow: 'hidden',
              margin: 0
            },
          }}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onMobileClose}
          onOpen={() => {}}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </SwipeableDrawer>

        {/* Mobile Menu Button */}
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            display: { xs: 'block', md: 'none' }
          }}
        >
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              outline: 'none',
              '&:focus': {
                outline: 'none',
                boxShadow: 2,
              },
              '&:focus-visible': {
                outline: 'none',
              },
              '&:hover': {
                bgcolor: 'background.paper',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </>
    );
  }

  // Desktop Drawer
  return (
    <Drawer
      sx={{
        width: isSidebarCollapsed ? 80 : 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isSidebarCollapsed ? 80 : 280,
          boxSizing: 'border-box',
          border: 'none',
          backgroundImage: 'none',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          borderRight: '0px solid transparent !important',
          outline: 'none !important',
          boxShadow: 'none !important',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '2px',
          },
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;