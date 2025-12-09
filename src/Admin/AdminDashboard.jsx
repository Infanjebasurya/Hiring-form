// src/Admin/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import Users from './components/Users/Users';
import Organizations from './components/Organizations/Organizations';
import Feedbacks from './components/Feedbacks/Feedbacks';
import AdminPlanUpgrade from './components/PlanUpgrade/AdminPlanUpgrade';

const AdminDashboard = ({ darkMode }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Routes>
        <Route path="/" element={<DashboardOverview darkMode={darkMode} />} />
        <Route path="/dashboard" element={<DashboardOverview darkMode={darkMode} />} />
        <Route path="/users" element={<Users darkMode={darkMode} />} />
        <Route path="/users/*" element={<Users darkMode={darkMode} />} />
        <Route path="/organizations" element={<Organizations darkMode={darkMode} />} />
        <Route path="/admin-plan" element={<AdminPlanUpgrade darkMode={darkMode} />} />
        <Route path="/feedbacks" element={<Feedbacks darkMode={darkMode} />} />
        
        {/* Catch all route for admin dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Box>
  );
};

export default AdminDashboard;