// src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
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
  Email,
  ArrowBack,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const ForgotPassword = ({ darkMode, onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess('Password reset instructions have been sent to your email');
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigate('/login');
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

        {/* Back Button */}
        <Tooltip title="Back to login">
          <IconButton
            onClick={handleBackToLogin}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              color: isDarkMode ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBack fontSize="small" />
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
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Enter your email to receive reset instructions
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

            {success && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 1 }}
              >
                {success}
              </Alert>
            )}

            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center',
                color: isDarkMode ? 'text.secondary' : 'text.secondary',
                mb: 2
              }}
            >
              Enter the email address associated with your account and we'll send you instructions to reset your password.
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={email}
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
                'Send Reset Instructions'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? 'text.secondary' : 'text.secondary'
                }}
              >
                Remember your password?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login"
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
                  Back to login
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;