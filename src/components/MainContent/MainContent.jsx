// src/components/MainContent/MainContent.jsx
import React from 'react';
import { Box } from '@mui/material';
import TopNavHeader from '../Layout/TopNavHeader/TopNavHeader';

const MainContent = ({ children, darkMode, isSidebarCollapsed }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease-in-out',
        width: `calc(100% - ${isSidebarCollapsed ? '80px' : '280px'})`,
        position: 'relative'
      }}
    >
      <TopNavHeader darkMode={darkMode} />
      
      {/* Content area with padding to account for fixed header */}
      <Box
        sx={{
          flexGrow: 1,
          mt: '80px', // Adjust this based on your header height
          p: 3,
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainContent;