// src/components/Auth/Register.jsx
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
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Business,
  Email,
  Language,
  LinkedIn,
  Work,
  LocationOn,
  Person,
  Lock,
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = ({ darkMode, onToggleTheme }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    linkedInUrl: '',
    currentRole: '',
    companyAddress: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.companyName || !formData.companyEmail || !formData.currentRole || 
        !formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // FIXED: Using proper regex constructor
    const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
    
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.companyEmail && !emailRegex.test(formData.companyEmail)) {
      setError('Please enter a valid company email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      transition: 'all 0.3s ease',
    }
  };

  const iconColor = isDarkMode ? 'text.secondary' : 'action.active';

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
          maxWidth: '650px',
          maxHeight: '90vh',
          borderRadius: 2,
          overflow: 'hidden',
          mx: 'auto',
          bgcolor: isDarkMode ? 'background.paper' : 'background.default',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
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

        {/* Header - Fixed */}
        <Box
          sx={{
            bgcolor: isDarkMode ? '#6366F1' : '#667eea',
            color: 'white',
            py: 3,
            px: 4,
            textAlign: 'center',
            transition: 'background-color 0.3s ease',
            flexShrink: 0
          }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ fontWeight: 700, mb: 0.5 }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Join TalentHub to streamline your hiring process
          </Typography>
        </Box>

        {/* Form Content - Scrollable */}
        <Box 
          sx={{ 
            px: 4,
            py: 4,
            overflow: 'auto',
            flex: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ borderRadius: 1 }}
              >
                {error}
              </Alert>
            )}

            {/* Company Information Section */}
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: isDarkMode ? 'text.primary' : '#334155',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'color 0.3s ease'
                }}
              >
                <Business fontSize="small" color="primary" />
                Company Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Email"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Role"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkedIn fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Address"
                    name="companyAddress"
                    multiline
                    rows={2}
                    value={formData.companyAddress}
                    onChange={handleChange}
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <LocationOn fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ 
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              transition: 'border-color 0.3s ease'
            }} />

            {/* Personal Information Section */}
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: isDarkMode ? 'text.primary' : '#334155',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'color 0.3s ease'
                }}
              >
                <Person fontSize="small" color="primary" />
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                {/* First Row: Name and Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Second Row: Only Password fields on the RIGHT side */}
                <Grid item xs={12} sm={6}>
                  {/* Empty space on left side */}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                            sx={{ color: iconColor }}
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Third Row: Only Confirm Password on the RIGHT side */}
                <Grid item xs={12} sm={6}>
                  {/* Empty space on left side */}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    size="small"
                    sx={textFieldStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" sx={{ color: iconColor }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            size="small"
                            sx={{ color: iconColor }}
                          >
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 2,
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
                'Create Account'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isDarkMode ? 'text.secondary' : 'text.secondary'
                }}
              >
                Already have an account?{' '}
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
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;