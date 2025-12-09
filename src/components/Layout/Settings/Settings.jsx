// src/pages/Settings/Settings.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business,
  Email,
  Language,
  LinkedIn,
  LocationOn,
  Person,
  Lock,
  CheckCircle,
  Cancel,
  Send,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Settings = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { user } = useAuth();
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationDialog, setVerificationDialog] = useState({
    open: false,
    email: '',
    type: '', // 'personal' or 'company'
    verificationCode: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Initialize profile state with user data
  const [profileData, setProfileData] = useState({
    // Company Information
    companyName: '',
    companyWebsite: '',
    linkedinUrl: '',
    companyAddress: '',
    
    // Personal Information
    name: '',
    email: '',
    emailVerified: false,
    phone: '',
    address: '',
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        emailVerified: user.emailVerified || false,
        companyName: user.company || '',
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset verification status if email is changed
    if (field === 'email' && value !== user?.email) {
      setProfileData(prev => ({
        ...prev,
        emailVerified: false
      }));
    }
  };

  // Send verification email
  const sendVerificationEmail = async (email, type) => {
    if (!email) {
      alert('Please enter an email address first');
      return false;
    }

    setIsSendingCode(true);
    try {
      // Simulate API call to send verification email
      console.log(`Sending verification email to ${email} for ${type}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call
      // await api.sendVerificationEmail(email, type);
      
      setVerificationDialog({
        open: true,
        email: email,
        type: type,
        verificationCode: '',
      });
      
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please try again.');
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify email with code
  const verifyEmail = async () => {
    const { email, type, verificationCode } = verificationDialog;
    
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate API call to verify email
      console.log(`Verifying ${type} email ${email} with code: ${verificationCode}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call
      // await api.verifyEmail(email, verificationCode, type);
      
      // Update verification status
      if (type === 'personal') {
        setProfileData(prev => ({
          ...prev,
          emailVerified: true
        }));
        
        // Update user context/local storage
        if (user) {
          const updatedUser = { ...user, emailVerified: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      setVerificationDialog(prev => ({ ...prev, open: false, verificationCode: '' }));
      alert('Email verified successfully!');
      
    } catch (error) {
      console.error('Error verifying email:', error);
      alert('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend verification code
  const resendVerificationCode = async () => {
    const { email, type } = verificationDialog;
    await sendVerificationEmail(email, type);
  };

  const handleSave = async () => {
    // Validate passwords match if changing password
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      alert('Please enter a valid personal email address');
      return;
    }

    try {
      // Simulate API call to save settings
      console.log('Saving profile:', profileData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update local storage with new data
      if (user) {
        const updatedUser = {
          ...user,
          name: profileData.name,
          email: profileData.email,
          emailVerified: profileData.email === user.email ? profileData.emailVerified : false,
          company: profileData.companyName,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const iconColor = theme.palette.mode === 'dark' ? 'text.secondary' : 'action.active';
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
      transition: 'all 0.3s ease',
    }
  };

  // Function to render verification status with action button
  const renderVerificationStatus = (isVerified, email, type) => {
    if (!email) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Chip
          icon={isVerified ? 
            <CheckCircle fontSize="small" /> : 
            <Cancel fontSize="small" />
          }
          label={isVerified ? "Verified" : "Not Verified"}
          size="small"
          variant="outlined"
          color={isVerified ? "success" : "error"}
          sx={{
            height: 24,
            '& .MuiChip-icon': {
              fontSize: '16px'
            }
          }}
        />
        {!isVerified && (
          <Button
            size="small"
            startIcon={isSendingCode ? <CircularProgress size={14} /> : <Send />}
            onClick={() => sendVerificationEmail(email, type)}
            disabled={isSendingCode}
            sx={{
              minWidth: 'auto',
              textTransform: 'none',
              fontSize: '0.75rem',
              height: 24,
            }}
          >
            Verify
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: 'all 0.3s ease',
        width: '100%',
        ml: 0,
        p: { xs: 2, md: 3 }
      }}
    >
      <Container 
        maxWidth="xl" 
        disableGutters={isMobile}
        sx={{ 
          height: '100%',
          px: isMobile ? 0 : 2
        }}
      >
        {/* Header */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pt: isMobile ? 1 : 0
        }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': { 
                bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100'
              },
              boxShadow: theme.shadows[1]
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="600"
            color="text.primary"
          >
            Settings
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              bgcolor: 'success.light',
              color: 'success.dark'
            }}
          >
            Profile updated successfully!
          </Alert>
        )}

        {/* Main Settings Paper */}
        <Paper 
          elevation={1}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
            minHeight: '70vh',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Section Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            Account Settings
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column - Edit Profile */}
            <Grid item xs={12} lg={6}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'text.primary'
                }}
              >
                Edit Profile
              </Typography>

              {/* Company Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
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
                      value={profileData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
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
                      label="Company Website"
                      value={profileData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
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
                      value={profileData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
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
                      multiline
                      rows={2}
                      value={profileData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
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
                my: 3, 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' 
              }} />

              {/* Personal Information Section */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Person fontSize="small" color="primary" />
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
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
                      {renderVerificationStatus(
                        profileData.emailVerified, 
                        profileData.email, 
                        'personal'
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Column - Change Password */}
            <Grid item xs={12} lg={6}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'text.primary'
                }}
              >
                Change Password
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={profileData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
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
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: iconColor }}
                          >
                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={profileData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
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
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: iconColor }}
                              >
                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={profileData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: iconColor }}
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Additional Settings Section */}
              <Box sx={{ mt: 6 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'text.primary'
                  }}
                >
                  Preferences
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 2
                  }}
                >
                  Manage your account preferences and notification settings.
                </Typography>
                
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    textTransform: 'none'
                  }}
                  onClick={() => {
                    console.log('Open preferences settings');
                  }}
                >
                  Manage Preferences
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.secondary',
                  bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                textTransform: 'none',
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Verification Code Dialog */}
      <Dialog 
        open={verificationDialog.open} 
        onClose={() => !isVerifying && setVerificationDialog(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Verify Email Address
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We've sent a verification code to <strong>{verificationDialog.email}</strong>. 
            Please enter the code below to verify your email address.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Verification Code"
            value={verificationDialog.verificationCode}
            onChange={(e) => setVerificationDialog(prev => ({ 
              ...prev, 
              verificationCode: e.target.value 
            }))}
            disabled={isVerifying}
            sx={{ mt: 2 }}
          />
          <Button 
            onClick={resendVerificationCode}
            disabled={isSendingCode}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            {isSendingCode ? 'Sending...' : 'Resend Code'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setVerificationDialog(prev => ({ ...prev, open: false }))}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={verifyEmail}
            variant="contained"
            disabled={isVerifying || !verificationDialog.verificationCode}
          >
            {isVerifying ? <CircularProgress size={20} /> : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;