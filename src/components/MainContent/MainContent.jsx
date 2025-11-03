import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import HiringForm from '../HiringForm/HiringForm'; // Adjust the import path as needed

const MainContent = ({ children, darkMode, isSidebarCollapsed }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <HiringForm darkMode={darkMode} isSidebarCollapsed={isSidebarCollapsed} />
  );
};

export default MainContent;