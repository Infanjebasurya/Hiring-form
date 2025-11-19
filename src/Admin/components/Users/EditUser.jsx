// src/Admin/components/Users/EditUser.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  Business
} from '@mui/icons-material';
import { updateUser, getUserById } from '../../../services/userService';
import { getOrganizations } from '../../../services/organizationService';

const EditUser = ({ darkMode, userId, onSave, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    role: '',
    organization: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load organizations
      const orgsData = getOrganizations();
      setOrganizations(orgsData);

      // Load user data
      const userData = getUserById(userId);
      if (userData) {
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || '',
          organization: userData.organization || '',
          status: userData.status || 'active'
        });
      } else {
        showSnackbar('User not found', 'error');
        onCancel();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      role: '',
      organization: ''
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
      isValid = false;
    }

    if (!formData.organization) {
      newErrors.organization = 'Organization is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOrganizationChange = (event, newValue) => {
    if (newValue && typeof newValue === 'object') {
      // Selected from dropdown - use the organization ID
      setFormData(prev => ({
        ...prev,
        organization: newValue.id
      }));
    } else if (typeof newValue === 'string' && newValue.trim()) {
      // Manual input - create a new organization ID from the name
      const newOrgId = newValue.toLowerCase().replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        organization: newOrgId
      }));
    } else {
      // Cleared or empty
      setFormData(prev => ({
        ...prev,
        organization: ''
      }));
    }

    // Clear error
    if (errors.organization) {
      setErrors(prev => ({
        ...prev,
        organization: ''
      }));
    }
  };

  const handleOrganizationInputChange = (event, newInputValue) => {
    // This handles the input field changes for free text
    if (newInputValue && !organizations.find(org => org.name === newInputValue)) {
      // If it's a new organization not in the list
      const newOrgId = newInputValue.toLowerCase().replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        organization: newOrgId
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Please fix the errors in the form', 'error');
      return;
    }

    setSaving(true);
    try {
      // Prepare the updated user data
      const updatedUserData = {
        ...formData,
        // Ensure we have the organization name for display
        organizationName: getSelectedOrganization()?.name || formData.organization
      };

      await updateUser(userId, updatedUserData);
      showSnackbar('User updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSelectedOrganization = () => {
    if (!formData.organization) return null;
    
    // First try to find by ID
    let org = organizations.find(org => org.id === formData.organization);
    
    // If not found by ID, try to find by name (for backward compatibility)
    if (!org) {
      org = organizations.find(org => 
        org.name.toLowerCase() === formData.organization.toLowerCase()
      );
    }
    
    return org;
  };

  const getOrganizationDisplayValue = () => {
    if (!formData.organization) return null;
    
    const org = getSelectedOrganization();
    if (org) {
      return org;
    }
    
    // If no organization found in the list, return a temporary object for display
    return { 
      id: formData.organization, 
      name: formData.organization,
      isCustom: true 
    };
  };

  const isCustomOrganization = () => {
    return !getSelectedOrganization();
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 2
    }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onCancel}
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              borderRadius: 1,
              px: 2,
              py: 0.75,
              fontSize: '0.875rem',
              minHeight: '36px',
              '&:hover': {
                bgcolor: theme.palette.action.hover,
                color: theme.palette.primary.main
              }
            }}
          >
            Back to Users
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 2
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Edit User
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: '0.875rem'
                }}
              >
                Update user information and permissions
              </Typography>
            </Box>

            {/* Quick Actions - Desktop */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                <Button
                  onClick={onCancel}
                  variant="outlined"
                  startIcon={<Cancel sx={{ fontSize: '18px' }} />}
                  disabled={saving}
                  sx={{
                    borderRadius: 1,
                    px: 2.5,
                    py: 0.75,
                    minWidth: '100px',
                    fontSize: '0.875rem',
                    minHeight: '40px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={<Save sx={{ fontSize: '18px' }} />}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 1,
                    px: 3,
                    py: 0.75,
                    minWidth: '130px',
                    fontSize: '0.875rem',
                    minHeight: '40px',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* User Profile Card - Left Side */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* User Avatar and Basic Info */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.75rem',
                      fontWeight: 600
                    }}
                  >
                    {getInitials(formData.name)}
                  </Avatar>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary,
                      fontSize: '1.1rem'
                    }}
                  >
                    {formData.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {formData.email}
                  </Typography>

                  <Chip
                    label={formData.role}
                    color={formData.role === 'HR' ? 'primary' : 'default'}
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.75rem',
                      height: '28px'
                    }}
                    size="small"
                  />
                </Box>

                {/* User Details */}
                <Box sx={{ space: 2 }}>
                  {/* Status */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1.5
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                        Account Status
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {formData.status === 'active' 
                          ? 'User can access the system' 
                          : 'User access is disabled'
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: formData.status === 'active' 
                          ? theme.palette.success.main + '20'
                          : theme.palette.error.main + '20',
                        color: formData.status === 'active'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        ml: 1
                      }}
                    >
                      {formData.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                    </Box>
                  </Box>

                  {/* Organization */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: theme.palette.background.default,
                    borderRadius: 1.5
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
                        Organization
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                        {getSelectedOrganization()?.name || formData.organization || 'Not assigned'}
                        {isCustomOrganization() && ' '}
                      </Typography>
                    </Box>
                    <Business color="primary" sx={{ fontSize: '1.25rem', ml: 1 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Edit Form - Right Side */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}
            >
              {/* Form Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 2.5
                }}
              >
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.25rem' }}>
                  User Information
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                  Update user details, role, and organization
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ p: 2.5 }}>
                {/* Personal Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Full Name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiInputBase-input': {
                              height: '20px',
                              padding: '10px 14px',
                              fontSize: '0.875rem'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        fullWidth
                        required
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiInputBase-input': {
                              height: '20px',
                              padding: '10px 14px',
                              fontSize: '0.875rem'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Role and Organization Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Role & Organization
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl 
                        fullWidth 
                        size="small" 
                        error={!!errors.role}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            height: '40px', // Fixed height
                            '& .MuiSelect-select': {
                              padding: '10px 14px',
                              fontSize: '0.875rem',
                              height: '20px',
                              minHeight: 'auto'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem',
                            '&.Mui-focused': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            },
                            '&.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                      >
                        <InputLabel 
                          shrink={true}
                          sx={{
                            backgroundColor: theme.palette.background.paper,
                            px: 0.5
                          }}
                        >
                          Role
                        </InputLabel>
                        <Select
                          value={formData.role}
                          onChange={handleInputChange('role')}
                          label="Role"
                          required
                          displayEmpty
                          sx={{
                            borderRadius: 1
                          }}
                        >
                          <MenuItem value="HR">HR</MenuItem>
                          <MenuItem value="Interviewer">Interviewer</MenuItem>
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.organization}>
                        <Autocomplete
                          freeSolo
                          options={organizations}
                          getOptionLabel={(option) => 
                            typeof option === 'string' ? option : option.name
                          }
                          value={getOrganizationDisplayValue()}
                          onChange={handleOrganizationChange}
                          onInputChange={handleOrganizationInputChange}
                          disabled={saving}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Organization"
                              size="small"
                              required
                              error={!!errors.organization}
                              helperText={errors.organization || "Select from list or type to create new"}
                              placeholder="Select or type organization name"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 1,
                                  height: '40px', // Fixed height
                                  padding: '0 !important',
                                  '& .MuiAutocomplete-input': {
                                    padding: '10px 14px !important',
                                    fontSize: '0.875rem',
                                    height: '20px'
                                  }
                                },
                                '& .MuiInputLabel-root': {
                                  fontSize: '0.875rem',
                                  '&.Mui-focused': {
                                    transform: 'translate(14px, -9px) scale(0.75)'
                                  },
                                  '&.MuiFormLabel-filled': {
                                    transform: 'translate(14px, -9px) scale(0.75)'
                                  }
                                }
                              }}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Business fontSize="small" color="primary" />
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                  {option.name}
                                </Typography>
                                {option.status && (
                                  <Chip 
                                    label={option.status} 
                                    size="small" 
                                    color={option.status === 'active' ? 'success' : 'default'}
                                    sx={{ ml: 'auto', fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            </li>
                          )}
                          isOptionEqualToValue={(option, value) => 
                            option.id === (value?.id || value)
                          }
                          sx={{
                            '& .MuiAutocomplete-root': {
                              height: '40px'
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {/* Organization Preview */}
                    {formData.organization && (
                      <Grid item xs={12}>
                        <Alert 
                          severity={isCustomOrganization() ? "warning" : "success"}
                          sx={{ 
                            borderRadius: 1,
                            py: 1,
                            fontSize: '0.875rem',
                            '& .MuiAlert-message': {
                              padding: '0'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business fontSize="small" />
                            <Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                Selected Organization: <strong>{getSelectedOrganization()?.name || formData.organization}</strong>
                              </Typography>
                              {/* {isCustomOrganization() && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                  This is a custom organization
                                </Typography>
                              )} */}
                            </Box>
                            {isCustomOrganization() && (
                              <Chip 
                                label="Custom" 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 'auto' }}
                              />
                            )}
                          </Box>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Account Settings */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 1,
                    width: '100%',
                    fontSize: '1rem'
                  }}>
                    Account Settings
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.status === 'active'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              status: e.target.checked ? 'active' : 'inactive'
                            }))}
                            color="success"
                            size="small"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              User Account Status
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                              {formData.status === 'active' 
                                ? 'Active - User can access the system'
                                : 'Inactive - User cannot access the system'
                              }
                            </Typography>
                          </Box>
                        }
                        sx={{
                          width: '100%',
                          m: 0,
                          p: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          bgcolor: theme.palette.background.default
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                  display: 'flex',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`
                }}>
                  <Button
                    onClick={onCancel}
                    variant="outlined"
                    startIcon={<Cancel sx={{ fontSize: '18px' }} />}
                    disabled={saving}
                    sx={{
                      borderRadius: 1,
                      px: isMobile ? 2 : 2.5,
                      py: 0.75,
                      minWidth: isMobile ? '90px' : '100px',
                      fontSize: '0.875rem',
                      minHeight: '40px'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save sx={{ fontSize: '18px' }} />}
                    disabled={saving}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 1,
                      px: isMobile ? 2.5 : 3,
                      py: 0.75,
                      minWidth: isMobile ? '120px' : '130px',
                      fontSize: '0.875rem',
                      minHeight: '40px',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                  >
                    {saving ? 'Saving...' : isMobile ? 'Save' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EditUser;