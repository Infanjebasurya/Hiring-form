// src/Admin/components/Dashboard/Home.jsx
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
  TrendingUp
} from '@mui/icons-material';
import { getUserStats, initializeUsers } from '../../../services/userService';

const Home = ({ darkMode }) => {
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
      <Box sx={{ p: isMobile ? 2 : 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
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
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                minHeight: isMobile ? 140 : 180,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ 
                p: isMobile ? 2 : 3, 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: 2
                }}>
                  <Box sx={{ flex: 1 }}>
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
                        textAlign: 'left'
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
                        textAlign: 'left'
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                        textAlign: 'left'
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
                      flexShrink: 0,
                      width: isMobile ? 48 : 56,
                      height: isMobile ? 48 : 56
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: isMobile ? 24 : 32 }
                    })}
                  </Box>
                </Box>
                
                {/* Trend Indicator */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 'auto',
                  width: '100%'
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

export default Home;