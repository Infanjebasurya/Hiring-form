// src/Admin/AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import Users from './components/Users/Users';

const AdminDashboard = ({ darkMode }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Routes>
        <Route path="/" element={<DashboardOverview darkMode={darkMode} />} />
        <Route path="/users" element={<Users darkMode={darkMode} />} />
        <Route path="/users/*" element={<Users darkMode={darkMode} />} />
        {/* Add other admin routes here */}
        <Route path="*" element={<DashboardOverview darkMode={darkMode} />} />
      </Routes>
    </Box>
  );
};

export default AdminDashboard;