import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route index element={<DashboardOverview darkMode={darkMode} />} />
        <Route path="users" element={<Users darkMode={darkMode} />} />
        <Route path="organizations" element={<Organizations darkMode={darkMode} />} />
        <Route path="adminplan" element={<AdminPlanUpgrade darkMode={darkMode} />} />
        <Route path="feedbacks" element={<Feedbacks darkMode={darkMode} />} />
        <Route path="*" element={<DashboardOverview darkMode={darkMode} />} />
      </Routes>
    </Box>
  );
};

export default AdminDashboard;