import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Divider,
  IconButton,
  Tooltip,
  SwipeableDrawer
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarHeader from './SidebarHeader';
import MenuSection from './MenuSection';
import ProgressBar from '../../Common/ProgressBar';
import UpgradeButton from './UpgradeButton';
import { sidebarMenu, planData } from '../../../data/sidebarData';

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
    2: true,
    3: true
  });

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

  const handleToggleSidebarClick = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    if (isMobile) onMobileClose();
  };

  // Mobile drawer content
  const drawerContent = (
    <>
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
      }}>
        {/* New Chat Button with Search Icon */}
        <Box sx={{ px: isMobile ? 2 : (isSidebarCollapsed ? 1 : 2), mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                New Chat
              </Box>
            ) : isSidebarCollapsed ? (
              <Tooltip title="New Chat" placement="right">
                <IconButton
                  onClick={handleNewChat}
                  sx={{
                    width: '100%',
                    height: 40,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                    color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
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
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
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
                    width: 40,
                    height: 40,
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
        <Box sx={{ px: isMobile ? 1 : (isSidebarCollapsed ? 1 : 1), flex: 1 }}>
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
        <Box sx={{ px: isMobile ? 2 : (isSidebarCollapsed ? 1 : 2) }}>
          {!isMobile && !isSidebarCollapsed && <Divider sx={{ my: 2, bgcolor: 'divider' }} />}
          
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
                  height: 40,
                  mb: 1,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
                  color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
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

          {/* Settings and Collapse Icon */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2
          }}>
            {/* Settings */}
            {isMobile ? (
              <Box
                onClick={handleSettings}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  flex: 1,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 1,
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
                Settings
              </Box>
            ) : isSidebarCollapsed ? (
              <Tooltip title="Settings" placement="right">
                <IconButton
                  onClick={handleSettings}
                  sx={{
                    color: 'text.secondary',
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
              <Box
                onClick={handleSettings}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  flex: 1,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 1,
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
                Settings
              </Box>
            )}

            {/* Collapse/Expand Sidebar Icon */}
            {!isMobile && (
              <Tooltip title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                <Box
                  onClick={handleToggleSidebarClick}
                  sx={{
                    color: 'text.secondary',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                      borderRadius: 1
                    }
                  }}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRightIcon fontSize="small" />
                  ) : (
                    <ChevronLeftIcon fontSize="small" />
                  )}
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        <SwipeableDrawer
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              border: 'none',
              backgroundImage: 'none',
            },
          }}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={onMobileClose}
          onOpen={() => {}}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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