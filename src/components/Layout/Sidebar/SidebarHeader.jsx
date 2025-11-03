import React from 'react';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const SidebarHeader = ({ darkMode, onToggleTheme, isSidebarCollapsed }) => {
  return (
    <Box sx={{ 
      p: isSidebarCollapsed ? 1 : 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
      alignItems: 'center',
      background: (theme) => 
        theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
      minHeight: 64,
    }}>
      {/* Logo */}
      {isSidebarCollapsed ? (
        <Tooltip title="AI Test" placement="right">
          <Typography
            sx={{
              background: 'linear-gradient(45deg, #6366F1, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            AI
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          variant="h5"
          sx={{
            background: 'linear-gradient(45deg, #6366F1, #EC4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '-0.5px',
          }}
        >
          AI Test
        </Typography>
      )}
      
      {/* Theme Toggle - Only show when expanded */}
      {!isSidebarCollapsed && (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              size="small"
              onClick={onToggleTheme}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(99, 102, 241, 0.1)',
                },
                '&:focus': {
                  outline: 'none', // Remove focus outline
                },
                '&:focus-visible': {
                  outline: 'none', // Remove focus outline for accessibility
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default SidebarHeader;