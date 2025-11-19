// src/Admin/components/Users/AddUser.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  Select,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Autocomplete,
  Chip
} from '@mui/material';
import { 
  ArrowBack, 
  Save, 
  Person, 
  Email, 
  Security, 
  Business
} from '@mui/icons-material';
import { addUser } from '../../../services/userService';
import { getOrganizations } from '../../../services/organizationService';

const AddUser = ({ darkMode, onSave, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    organization: ''
  });
  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [organizationInput, setOrganizationInput] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = () => {
    try {
      const orgsData = getOrganizations();
      const activeOrgs = orgsData.filter(org => org.status === 'active');
      setOrganizations(activeOrgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.organization) {
      newErrors.organization = 'Organization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Prepare user data
        const userData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          organization: formData.organization,
          // Store organization name for display
          organizationName: getSelectedOrganizationName()
        };

        // Save user to localStorage
        addUser(userData);
        
        setSnackbar({ 
          open: true, 
          message: 'User created successfully!', 
          severity: 'success' 
        });
        
        // Call the parent onSave callback after a short delay
        setTimeout(() => {
          onSave(userData);
        }, 1000);
        
      } catch (error) {
        console.error('Error creating user:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error creating user', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    }
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
    console.log('Organization changed:', newValue);
    
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
    setOrganizationInput(newInputValue);
    
    // If user is typing manually and it's not matching any existing organization
    if (newInputValue && !organizations.find(org => org.name === newInputValue)) {
      const newOrgId = newInputValue.toLowerCase().replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        organization: newOrgId
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getSelectedOrganizationName = () => {
    if (!formData.organization) return '';
    
    // Check if it's an existing organization
    const existingOrg = organizations.find(org => org.id === formData.organization);
    if (existingOrg) {
      return existingOrg.name;
    }
    
    // Return the manual input value (convert ID back to readable name)
    return formData.organization.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getOrganizationDisplayValue = () => {
    if (!formData.organization) return null;
    
    // First try to find by ID
    let org = organizations.find(org => org.id === formData.organization);
    
    // If not found by ID, try to find by name (for backward compatibility)
    if (!org) {
      org = organizations.find(org => 
        org.name.toLowerCase() === formData.organization.toLowerCase()
      );
    }
    
    if (org) {
      return org;
    }
    
    // If no organization found in the list, return a temporary object for display
    return { 
      id: formData.organization, 
      name: getSelectedOrganizationName(),
      isCustom: true 
    };
  };

  const isManualOrganization = () => {
    return formData.organization && !organizations.find(org => org.id === formData.organization);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, width: '100%', maxWidth: '100%' }}>
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

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={onCancel}
        sx={{
          mb: 3,
          color: theme.palette.text.secondary,
          borderRadius: 2,
          px: 2,
          '&:hover': {
            color: theme.palette.primary.main,
            bgcolor: theme.palette.primary.main + '10'
          }
        }}
      >
        Back to Users
      </Button>

      {/* Form */}
      <Card
        sx={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Add New User
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.8
              }}
            >
              Create a new user account with appropriate role, organization and permissions
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Person color="primary" />
                    Full Name
                  </Typography>
                  <TextField
                    placeholder="Enter the full name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: theme.palette.background.default,
                        borderRadius: 2,
                        height: '40px',
                        '& .MuiInputBase-input': {
                          height: '20px',
                          padding: '10px 14px',
                          fontSize: '0.875rem'
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.875rem'
                      }
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Email color="primary" />
                    Email Address
                  </Typography>
                  <TextField
                    placeholder="Enter the user email address"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: theme.palette.background.default,
                        borderRadius: 2,
                        height: '40px',
                        '& .MuiInputBase-input': {
                          height: '20px',
                          padding: '10px 14px',
                          fontSize: '0.875rem'
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.875rem'
                      }
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Role Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Security color="primary" />
                    Select Role
                  </Typography>
                  <Select
                    value={formData.role}
                    onChange={handleInputChange('role')}
                    error={!!errors.role}
                    displayEmpty
                    disabled={loading}
                    sx={{
                      background: theme.palette.background.default,
                      borderRadius: 2,
                      height: '40px',
                      '& .MuiSelect-select': {
                        padding: '10px 14px',
                        fontSize: '0.875rem',
                        height: '20px',
                        minHeight: 'auto'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a user role</em>
                    </MenuItem>
                    <MenuItem value="HR">HR Manager</MenuItem>
                    <MenuItem value="Interviewer">Interviewer</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Organization Field with FreeSolo Autocomplete */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.organization}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Business color="primary" />
                    Organization
                  </Typography>
                  <Autocomplete
                    freeSolo
                    options={organizations}
                    getOptionLabel={(option) => 
                      typeof option === 'string' ? option : option.name
                    }
                    value={getOrganizationDisplayValue()}
                    onChange={handleOrganizationChange}
                    onInputChange={handleOrganizationInputChange}
                    inputValue={organizationInput}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type or select organization"
                        error={!!errors.organization}
                        helperText={errors.organization || "Select from list or type to create new organization"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: theme.palette.background.default,
                            borderRadius: 2,
                            height: '40px',
                            padding: '0 !important',
                            '& .MuiAutocomplete-input': {
                              padding: '10px 14px !important',
                              fontSize: '0.875rem',
                              height: '20px'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.875rem'
                          }
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Business color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                              Status: {option.status}
                            </Typography>
                          </Box>
                          {option.status === 'active' && (
                            <Chip 
                              label="Active" 
                              size="small" 
                              color="success"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) => 
                      option.id === (value?.id || value)
                    }
                    filterOptions={(options, params) => {
                      const filtered = options.filter(option =>
                        option.name.toLowerCase().includes(params.inputValue.toLowerCase())
                      );

                      // Suggest the creation of a new value
                      if (params.inputValue !== '' && !filtered.some(option => 
                        option.name.toLowerCase() === params.inputValue.toLowerCase()
                      )) {
                        filtered.push({
                          id: params.inputValue.toLowerCase().replace(/\s+/g, '-'),
                          name: params.inputValue,
                          isCustom: true
                        });
                      }

                      return filtered;
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Selected Organization Preview */}
              {formData.organization && (
                <Grid item xs={12}>
                  <Alert 
                    severity={isManualOrganization() ? "warning" : "success"}
                    sx={{ 
                      background: isManualOrganization() 
                        ? theme.palette.warning.main + '10'
                        : theme.palette.success.main + '10',
                      color: isManualOrganization() 
                        ? theme.palette.warning.main
                        : theme.palette.success.main,
                      border: `1px solid ${isManualOrganization() 
                        ? theme.palette.warning.main + '30'
                        : theme.palette.success.main + '30'
                      }`,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: isManualOrganization() 
                          ? theme.palette.warning.main
                          : theme.palette.success.main
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Selected Organization: <strong>{getSelectedOrganizationName()}</strong>
                        </Typography>
                        {isManualOrganization() && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            This is a new organization that will be created
                          </Typography>
                        )}
                      </Box>
                      {isManualOrganization() && (
                        <Chip 
                          label="New" 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 'auto' }}
                        />
                      )}
                    </Box>
                  </Alert>
                </Grid>
              )}

              {/* Note */}
              <Grid item xs={12}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    background: theme.palette.info.main + '10',
                    color: theme.palette.info.main,
                    border: `1px solid ${theme.palette.info.main}30`,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: theme.palette.info.main
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Note: The password will be auto-generated and sent via email to the user as soon as the user is saved.
                  </Typography>
                </Alert>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <Button
                    onClick={onCancel}
                    variant="outlined"
                    fullWidth={isMobile}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    fullWidth={isMobile}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      },
                      transition: 'all 0.3s ease',
                      '&:disabled': {
                        opacity: 0.6
                      }
                    }}
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser;