// src/Admin/components/Dashboard/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  People,
  Group,
  Person,
  TrendingUp,
  Business
} from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';

const DashboardOverview = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize users with sample data if empty
    initializeUsers();
    
    // Load stats
    loadStats();
  }, []);

  const loadStats = () => {
    setLoading(true);
    try {
      const statsData = getUserStats();
      
      const statsArray = [
        { 
          title: 'Total HR Users', 
          value: statsData.totalHR.toString(), 
          icon: <People />, 
          color: '#3498DB',
          description: 'Human Resource managers'
        },
        { 
          title: 'Total Interviewers', 
          value: statsData.totalInterviewers.toString(), 
          icon: <Group />, 
          color: '#2ECC71',
          description: 'Active interviewers'
        },
        { 
          title: 'Total Users', 
          value: statsData.totalUsers.toString(), 
          icon: <Person />, 
          color: '#9B59B6',
          description: 'All system users'
        },
        { 
          title: 'Total Organizations', 
          value: (statsData.totalOrganizations || '12').toString(),
          icon: <Business />, 
          color: '#E74C3C',
          description: 'Registered organizations'
        }
      ];
      
      setStats(statsArray);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        p: isMobile ? 2 : 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 200 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: theme.palette.text.secondary,
            opacity: 0.8
          }}
        >
          Welcome to your admin dashboard
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                },
                height: '100%',
                minHeight: 200, // Fixed minimum height for all cards
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ 
                p: isMobile ? 2 : 3, 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  flex: 1,
                  mb: 2
                }}>
                  <Box sx={{ flex: 1, minHeight: 80 }}>
                    <Typography 
                      variant={isMobile ? "h4" : "h3"} 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        background: `linear-gradient(135deg, ${stat.color}, ${theme.palette.mode === 'dark' ? '#fff' : '#000'})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.2,
                        minHeight: isMobile ? 40 : 48
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        color: theme.palette.text.primary,
                        lineHeight: 1.3,
                        minHeight: isMobile ? 24 : 32
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                        lineHeight: 1.4
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 3,
                      bgcolor: stat.color + '15',
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 2,
                      minWidth: isMobile ? 48 : 56,
                      height: isMobile ? 48 : 56,
                      flexShrink: 0
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                
                {/* Trend Indicator - Fixed at bottom */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 'auto'
                }}>
                  <TrendingUp sx={{ fontSize: 16, color: '#2ECC71', mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#2ECC71',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    Active
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;