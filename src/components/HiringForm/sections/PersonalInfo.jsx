import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  useMediaQuery,
  Typography  // Added this import
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person,
  Work,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Language,
  Public
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert } from '../components/FormComponents';
import { validateField, formatPhoneNumber, normalizeUrl } from '../utils/validation';

const PersonalInfo = ({
  formData,
  errors,
  handleInputChange,
  darkMode = false,
  touched = {},
  handleBlur
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const jobTitles = [
    'Senior Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Project Manager',
    'Quality Assurance Engineer',
    'System Administrator',
    'Security Engineer',
    'Mobile Developer',
    'Technical Lead',
    'Software Architect'
  ];

  const handleFieldChange = (field, value) => {
    let processedValue = value;

    // Apply formatting/normalization based on field type
    switch (field) {
      case 'contactNumber':
        processedValue = formatPhoneNumber(value);
        break;
      case 'linkedin':
      case 'portfolio':
      case 'website':
        if (value) {
          processedValue = normalizeUrl(value, field === 'linkedin' ? 'linkedin' : '');
        }
        break;
      default:
        break;
    }

    handleInputChange(field, processedValue);
  };

  const handleFieldBlur = (field) => {
    handleBlur?.(field);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: { xs: 1, sm: 2, md: 3 } }}>
        <InfoAlert
          icon={<Person />}
          title="Personal Information"
          darkMode={darkMode}
        >
          Please provide your personal and contact information. All fields marked with * are required. LinkedIn profile is mandatory for professional verification.
        </InfoAlert>

        <Grid container spacing={isSmallMobile ? 1.5 : 2}>
          {/* First Name & Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleFieldBlur('firstName')}
              error={!!errors.firstName && touched.firstName}
              helperText={touched.firstName ? errors.firstName : ''}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              inputProps={{
                maxLength: 50
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => handleFieldBlur('lastName')}
              error={!!errors.lastName && touched.lastName}
              helperText={touched.lastName ? errors.lastName : ''}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              inputProps={{
                maxLength: 50
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                }
              }}
            />
          </Grid>

          {/* Desired Position - Full Width */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              required
              error={!!errors.jobTitle && touched.jobTitle}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
            >
              <InputLabel
                id="desired-position-label"
                sx={{
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  backgroundColor: darkMode ? '#1e1e1e' : 'white',
                  px: 0.5
                }}
              >
                Desired Position *
              </InputLabel>
              <Select
                labelId="desired-position-label"
                name="jobTitle"
                value={formData.jobTitle}
                label="Desired Position *"
                onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                onBlur={() => handleFieldBlur('jobTitle')}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: isSmallMobile ? '10px 14px' : '16.5px 14px',
                    fontSize: isSmallMobile ? '0.875rem' : '1rem',
                    '& .MuiBox-root': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%'
                    }
                  }
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'text.disabled',
                        fontSize: isSmallMobile ? '0.875rem' : '1rem'
                      }}>
                        <Work fontSize={isSmallMobile ? "small" : "medium"} />
                        Select a position
                      </Box>
                    );
                  }
                  return (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: isSmallMobile ? '0.875rem' : '1rem'
                    }}>
                      <Work fontSize={isSmallMobile ? "small" : "medium"} />
                      {selected}
                    </Box>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                      color: darkMode ? 'white' : 'inherit',
                      maxHeight: isSmallMobile ? 250 : 300,
                      '& .MuiMenuItem-root': {
                        padding: isSmallMobile ? '8px 12px' : '8px 16px',
                        minHeight: 'auto',
                        fontSize: isSmallMobile ? '0.875rem' : '1rem',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                {jobTitles.map((title) => (
                  <MenuItem
                    key={title}
                    value={title}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: isSmallMobile ? '0.875rem' : '1rem'
                    }}
                  >
                    <Work fontSize={isSmallMobile ? "small" : "medium"} />
                    {title}
                  </MenuItem>
                ))}
              </Select>
              {errors.jobTitle && touched.jobTitle && (
                <FormHelperText error sx={{ fontSize: isSmallMobile ? '0.75rem' : '0.875rem' }}>
                  {errors.jobTitle}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Email & Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              error={!!errors.email && touched.email}
              helperText={touched.email ? errors.email : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.email && touched.email ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="your.email@example.com"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
              onBlur={() => handleFieldBlur('contactNumber')}
              error={!!errors.contactNumber && touched.contactNumber}
              helperText={touched.contactNumber ? errors.contactNumber : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.contactNumber && touched.contactNumber ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="+1 (555) 123-4567"
              inputProps={{
                maxLength: 25
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                }
              }}
            />
          </Grid>

          {/* Location - Full Width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Location"
              name="location"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              onBlur={() => handleFieldBlur('location')}
              error={!!errors.location && touched.location}
              helperText={touched.location ? errors.location : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.location && touched.location ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="City, Country"
              inputProps={{
                maxLength: 100
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                }
              }}
            />
          </Grid>

          {/* LinkedIn - Full Width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="LinkedIn Profile"
              name="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              onBlur={() => handleFieldBlur('linkedin')}
              error={!!errors.linkedin && touched.linkedin}
              helperText={touched.linkedin ? errors.linkedin : "Must be a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedIn 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.linkedin && touched.linkedin ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://linkedin.com/in/yourprofile"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                },
                '& .MuiFormHelperText-root': {
                  fontSize: isSmallMobile ? '0.7rem' : '0.75rem'
                }
              }}
            />
          </Grid>

          {/* Portfolio & Website */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Portfolio Website"
              name="portfolio"
              value={formData.portfolio}
              onChange={(e) => handleFieldChange('portfolio', e.target.value)}
              onBlur={() => handleFieldBlur('portfolio')}
              error={!!errors.portfolio && touched.portfolio}
              helperText={touched.portfolio ? errors.portfolio : "Optional"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.portfolio && touched.portfolio ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://yourportfolio.com"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                },
                '& .MuiFormHelperText-root': {
                  fontSize: isSmallMobile ? '0.7rem' : '0.75rem'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Personal Website/Blog"
              name="website"
              value={formData.website}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              onBlur={() => handleFieldBlur('website')}
              error={!!errors.website && touched.website}
              helperText={touched.website ? errors.website : "Optional"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Public 
                      fontSize={isSmallMobile ? "small" : "medium"} 
                      color={errors.website && touched.website ? "error" : "primary"} 
                    />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://yourwebsite.com"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: isSmallMobile ? '0.875rem' : '1rem',
                  padding: isSmallMobile ? '10px 14px' : '16.5px 14px'
                },
                '& .MuiFormHelperText-root': {
                  fontSize: isSmallMobile ? '0.7rem' : '0.75rem'
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Required Fields Note */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
          >
            * Required fields
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default PersonalInfo;