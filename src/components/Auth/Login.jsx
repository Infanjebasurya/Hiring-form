// src/components/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Email,
  Lock,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const Login = ({ darkMode, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [user, isAdmin, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Success - the useEffect above will handle redirection based on user role
      console.log('Login successful');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDarkMode ? 'background.default' : '#f5f7fa',
        p: 2,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Paper 
        elevation={isDarkMode ? 2 : 3}
        sx={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: 2,
          overflow: 'hidden',
          mx: 'auto',
          bgcolor: isDarkMode ? 'background.paper' : 'background.default',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {/* Theme Toggle Button */}
        <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton
            onClick={onToggleTheme}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              color: isDarkMode ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isDarkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Header */}
        <Box
          sx={{
            bgcolor: isDarkMode ? '#6366F1' : '#667eea',
            color: 'white',
            py: 4,
            px: 4,
            textAlign: 'center',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ fontWeight: 700, mb: 0.5 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Sign in to your TalentHub account
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ px: 4, py: 4 }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1 }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email 
                      fontSize="small" 
                      sx={{ 
                        color: isDarkMode ? 'text.secondary' : 'action.active' 
                      }} 
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock 
                      fontSize="small" 
                      sx={{ 
                        color: isDarkMode ? 'text.secondary' : 'action.active' 
                      }} 
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                      sx={{
                        color: isDarkMode ? 'text.secondary' : 'action.active'
                      }}
                    >
                      {showPassword ? 
                        <VisibilityOff fontSize="small" /> : 
                        <Visibility fontSize="small" />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right' }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isDarkMode ? '#818cf8' : '#667eea',
                  '&:hover': {
                    textDecoration: 'underline'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: isDarkMode ? '#6366F1' : '#667eea',
                color: 'white',
                '&:hover': {
                  bgcolor: isDarkMode ? '#4f46e5' : '#5568d3'
                },
                '&:disabled': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white' 
                  }} 
                />
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? 'text.secondary' : 'text.secondary'
                }}
              >
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isDarkMode ? '#818cf8' : '#667eea',
                    '&:hover': {
                      textDecoration: 'underline'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  Sign up now
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;