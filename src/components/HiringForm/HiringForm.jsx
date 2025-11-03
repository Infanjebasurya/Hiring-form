import React, { useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Tooltip,
  useTheme,
  useMediaQuery,
  Container,
  Fade,
  Zoom,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Upload,
  AttachFile,
  Delete,
  Add,
  Work,
  School,
  Person,
  Description,
  LinkedIn,
  Language,
  Star,
  StarBorder,
  CalendarToday,
  LocationOn,
  Email,
  Phone,
  Public,
  Code,
  Group,
  Build,
  Psychology,
  Interests,
  CloudUpload,
  CheckCircle,
  Warning,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import ReviewSubmission from './ReviewSubmission';

// Create theme instances for light and dark mode
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
        // Dark mode palette
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
      }
      : {
        // Light mode palette
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: 'rgba(0, 0, 0, 0.6)',
        },
      }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
            },
          },
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

// Create a context for the dark mode
const DarkModeContext = React.createContext();

const HiringForm = ({ darkMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create theme based on darkMode prop
  const theme = React.useMemo(() =>
    createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    jobTitle: '',
    contactNumber: '',
    email: '',
    location: '',
    linkedin: '',
    portfolio: '',
    website: '',

    // Professional Summary
    professionalSummary: '',

    // Skills with Experience
    skills: [],
    newSkill: '',
    skillExperience: '',
    skillCategory: 'technical',

    // Professional Experience
    experiences: [{
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      responsibilities: '',
      achievements: '',
      technologies: '',
      currentlyWorking: false
    }],

    // Projects
    projects: [{
      projectName: '',
      description: '',
      role: '',
      technologies: '',
      achievements: '',
      projectLink: ''
    }],

    // Education
    education: [{
      degree: '',
      institution: '',
      university: '',
      startYear: '',
      endYear: '',
      location: '',
      currentlyStudying: false
    }],

    // Languages
    languages: [],
    newLanguage: '',
    proficiency: 'intermediate',

    // Hobbies
    hobbies: [],
    newHobby: '',

    // Documents
    resume: null,
    coverLetter: null,

    // Terms
    termsAccepted: false,
    privacyAccepted: false
  });

  const steps = [
    'Personal Info',
    'Summary',
    'Skills',
    'Experience',
    'Projects & Education',
    'Documents',
    'Review'
  ];

  const stepIcons = [
    <Person fontSize="small" />,
    <Description fontSize="small" />,
    <Code fontSize="small" />,
    <Work fontSize="small" />,
    <School fontSize="small" />,
    <AttachFile fontSize="small" />,
    <CheckCircle fontSize="small" />
  ];

  const fullStepLabels = [
    'Personal Information',
    'Professional Summary',
    'Skills & Expertise',
    'Work Experience',
    'Projects & Education',
    'Documents & Additional',
    'Review & Submit'
  ];

  const skillCategories = [
    { value: 'technical', label: 'Technical Skills', icon: <Code /> },
    { value: 'soft', label: 'Soft Skills', icon: <Psychology /> },
    { value: 'tools', label: 'Tools & Technologies', icon: <Build /> },
    { value: 'frameworks', label: 'Frameworks & Platforms', icon: <Group /> }
  ];

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'native', label: 'Native' }
  ];

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

  // URL Validation functions
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidLinkedInUrl = (url) => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return (
        (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
        parsedUrl.hostname.includes('linkedin.com')
      );
    } catch {
      return false;
    }
  };

  const isValidPortfolioUrl = (url) => {
    if (!url) return true; // Portfolio is optional
    return isValidUrl(url);
  };

  const isValidWebsiteUrl = (url) => {
    if (!url) return true; // Website is optional
    return isValidUrl(url);
  };

  const isValidProjectUrl = (url) => {
    if (!url) return true; // Project URL is optional
    return isValidUrl(url);
  };

  // Enhanced Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.contactNumber.trim()) {
          newErrors.contactNumber = 'Contact number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactNumber.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.contactNumber = 'Please enter a valid phone number';
        }
        // LinkedIn Validation
        if (!formData.linkedin.trim()) {
          newErrors.linkedin = 'LinkedIn profile URL is required';
        } else if (!isValidLinkedInUrl(formData.linkedin)) {
          newErrors.linkedin = 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)';
        }
        // Portfolio Validation
        if (formData.portfolio && !isValidPortfolioUrl(formData.portfolio)) {
          newErrors.portfolio = 'Please enter a valid portfolio URL (e.g., https://yourportfolio.com)';
        }
        // Website Validation
        if (formData.website && !isValidWebsiteUrl(formData.website)) {
          newErrors.website = 'Please enter a valid website URL (e.g., https://yourwebsite.com)';
        }
        break;

      case 1:
        if (!formData.professionalSummary.trim()) {
          newErrors.professionalSummary = 'Professional summary is required';
        } else if (formData.professionalSummary.length < 100) {
          newErrors.professionalSummary = 'Professional summary should be at least 100 characters';
        } else if (formData.professionalSummary.length > 1000) {
          newErrors.professionalSummary = 'Professional summary should not exceed 1000 characters';
        }
        break;

      case 2:
        if (formData.skills.length === 0) {
          newErrors.skills = 'At least one skill is required';
        }
        break;

      case 3:
        formData.experiences.forEach((exp, index) => {
          if (!exp.jobTitle.trim()) newErrors[`experience_${index}_jobTitle`] = 'Job title is required';
          if (!exp.company.trim()) newErrors[`experience_${index}_company`] = 'Company name is required';
          if (!exp.startDate) newErrors[`experience_${index}_startDate`] = 'Start date is required';
        });
        break;

      case 4:
        // Validate project URLs
        formData.projects.forEach((project, index) => {
          if (project.projectLink && !isValidProjectUrl(project.projectLink)) {
            newErrors[`project_${index}_link`] = 'Please enter a valid project URL';
          }
        });
        break;

      case 5:
        if (!formData.resume) newErrors.resume = 'Resume is required';
        if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
          newErrors.resume = 'Resume file size must be less than 5MB';
        }
        if (formData.coverLetter && formData.coverLetter.size > 5 * 1024 * 1024) {
          newErrors.coverLetter = 'Cover letter file size must be less than 5MB';
        }
        break;

      case 6:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'You must accept the privacy policy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));

    const errorKey = `${arrayName}_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template }]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      const maxSize = 5;

      if (fileSizeMB > maxSize) {
        setErrors(prev => ({
          ...prev,
          [field]: `File size must be less than ${maxSize}MB`
        }));
        return;
      }

      const allowedTypes = {
        resume: ['.pdf', '.doc', '.docx'],
        coverLetter: ['.pdf', '.doc', '.docx']
      };

      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes[field].includes(fileExtension)) {
        setErrors(prev => ({
          ...prev,
          [field]: `File type must be ${allowedTypes[field].join(', ')}`
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && formData.skillExperience) {
      const newSkill = {
        name: formData.newSkill.trim(),
        experience: formData.skillExperience,
        category: formData.skillCategory
      };

      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
        newSkill: '',
        skillExperience: ''
      }));
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddLanguage = () => {
    if (formData.newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, {
          name: formData.newLanguage.trim(),
          proficiency: formData.proficiency
        }],
        newLanguage: ''
      }));
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddHobby = () => {
    if (formData.newHobby.trim()) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, formData.newHobby.trim()],
        newHobby: ''
      }));
    }
  };

  const handleRemoveHobby = (index) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (validateStep(6)) {
      setIsSubmitting(true);
      try {
        // Simulate API call with file upload
        const submissionData = new FormData();

        // Append all form data
        Object.keys(formData).forEach(key => {
          if (key === 'resume' || key === 'coverLetter') {
            if (formData[key]) {
              submissionData.append(key, formData[key]);
            }
          } else if (Array.isArray(formData[key])) {
            submissionData.append(key, JSON.stringify(formData[key]));
          } else {
            submissionData.append(key, formData[key]);
          }
        });

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
              resolve({ success: true, message: 'Application submitted successfully!' });
            } else {
              reject(new Error('Network error. Please try again.'));
            }
          }, 3000);
        });

        alert('🎉 Application submitted successfully! We will review your application and get back to you soon.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          jobTitle: '',
          contactNumber: '',
          email: '',
          location: '',
          linkedin: '',
          portfolio: '',
          website: '',
          professionalSummary: '',
          skills: [],
          newSkill: '',
          skillExperience: '',
          skillCategory: 'technical',
          experiences: [{
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            location: '',
            responsibilities: '',
            achievements: '',
            technologies: '',
            currentlyWorking: false
          }],
          projects: [{
            projectName: '',
            description: '',
            role: '',
            technologies: '',
            achievements: '',
            projectLink: ''
          }],
          education: [{
            degree: '',
            institution: '',
            university: '',
            startYear: '',
            endYear: '',
            location: '',
            currentlyStudying: false
          }],
          languages: [],
          newLanguage: '',
          proficiency: 'intermediate',
          hobbies: [],
          newHobby: '',
          resume: null,
          coverLetter: null,
          termsAccepted: false,
          privacyAccepted: false
        });
        setActiveStep(0);
      } catch (error) {
        console.error('Submission error:', error);
        alert('❌ There was an error submitting your application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Step 1: Personal Information
  const renderPersonalInfo = () => (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: '1px solid',
            borderColor: darkMode ? '#3949ab' : '#90caf9',
            color: darkMode ? 'white' : 'inherit'
          }}
          icon={<Person />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Personal Information
          </Typography>
          Please provide your personal and contact information. All fields marked with * are required. LinkedIn profile is mandatory for professional verification.
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth
              required
              error={!!errors.jobTitle}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
            >
              <InputLabel
                id="desired-position-label"
                shrink={true}
              >
                Desired Position
              </InputLabel>
              <Select
                labelId="desired-position-label"
                value={formData.jobTitle}
                label="Desired Position"
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                displayEmpty
                inputProps={{
                  'aria-label': 'Desired Position',
                }}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16.5px 14px',
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
                        color: 'text.disabled'
                      }}>
                        <Work fontSize="small" />
                        Select a position
                      </Box>
                    );
                  }
                  return (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Work fontSize="small" />
                      {selected}
                    </Box>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                      color: darkMode ? 'white' : 'inherit',
                      '& .MuiMenuItem-root': {
                        padding: '8px 16px',
                        minHeight: '48px',
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
                      gap: 1
                    }}
                  >
                    <Work fontSize="small" />
                    {title}
                  </MenuItem>
                ))}
              </Select>
              {errors.jobTitle && (
                <FormHelperText error>{errors.jobTitle}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="your.email@example.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Contact Number"
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Phone color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="+91 (967) 123-4567"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationOn color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="City, Country"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="LinkedIn Profile *"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              error={!!errors.linkedin}
              helperText={errors.linkedin || "Must be a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)"}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LinkedIn color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Portfolio Website"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              error={!!errors.portfolio}
              helperText={errors.portfolio || "Optional - Must be a valid URL if provided"}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Language color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://yourportfolio.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Personal Website/Blog"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              error={!!errors.website}
              helperText={errors.website || "Optional - Must be a valid URL if provided"}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Public color="primary" /></InputAdornment>,
              }}
              variant="outlined"
              size={isSmallMobile ? "small" : "medium"}
              placeholder="https://yourwebsite.com"
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );






  // Step 2: Professional Summary - Matched width with Experience & Skills sections
const renderProfessionalSummary = () => (
  <Fade in={true} timeout={500}>
    <Box
      sx={{
        mt: 3,
        maxWidth: "1550px", // ✅ increased width
        mx: "auto",          // ✅ centers it on the page
        width: "100%",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Info Banner */}
      <Alert
        severity="info"
        sx={{
          mb: 3,
          background: darkMode
            ? 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)'
            : 'linear-gradient(135deg, #e8f5e8 0%, #f0f4c3 100%)',
          border: '1px solid',
          borderColor: darkMode ? '#388e3c' : '#81c784',
          color: darkMode ? 'white' : 'inherit',
        }}
        icon={<Description />}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Professional Summary
        </Typography>
        Write a compelling professional summary that highlights your experience, strengths, and career objectives.
      </Alert>

      {/* Summary Field */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          required
          fullWidth
          multiline
          rows={isMobile ? 6 : 8}
          label="Professional Summary"
          value={formData.professionalSummary}
          onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
          error={!!errors.professionalSummary}
          helperText={
            errors.professionalSummary ||
            `${formData.professionalSummary.length}/1000 characters (Minimum 100 characters required)`
          }
          placeholder="Example: Experienced full-stack developer with 5+ years in building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about creating efficient, user-friendly solutions and leading development teams to deliver high-quality products. Seeking to leverage technical expertise in a challenging senior developer role."
          variant="outlined"
          inputProps={{ maxLength: 1000 }}
          size={isSmallMobile ? "small" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              minHeight: '150px',
              fontSize: '1rem',
            },
          }}
        />
      </Box>
    </Box>
  </Fade>
);






// Step 3: Skills with Experience - Matched width & style to Experience section
const renderSkills = () => (
  <Fade in={true} timeout={500}>
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Box
          sx={{
            mt: 3,
            maxWidth: "1550px", // ✅ Increased width
            mx: "auto",
            width: "100%",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* Info Banner */}
          <Alert
            severity="info"
            sx={{
              mb: 3,
              background: darkMode
                ? 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)'
                : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
              border: '1px solid',
              borderColor: darkMode ? '#6d4c41' : '#ffb74d',
              color: darkMode ? 'white' : 'inherit',
            }}
            icon={<Code />}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Skills & Expertise
            </Typography>
            Add your skills with experience levels. Categorize them for better organization. At least one skill is required.
          </Alert>

          {/* Section Header */}
          <Typography
            variant="h6"
            color="primary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              fontSize: "1.2rem",
            }}
          >
            <Code color="primary" />
            Add New Skill
          </Typography>

          {/* Add Skill Form */}
          <Box
            sx={{
              border: darkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              p: 3,
              mb: 3,
              backgroundColor: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                  <InputLabel>Skill Category</InputLabel>
                  <Select
                    value={formData.skillCategory}
                    label="Skill Category"
                    onChange={(e) => handleInputChange('skillCategory', e.target.value)}
                    variant="outlined"
                  >
                    {skillCategories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {category.icon}
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  value={formData.newSkill}
                  onChange={(e) => handleInputChange('newSkill', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddSkill();
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., React, Python, Leadership"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Experience"
                  value={formData.skillExperience}
                  onChange={(e) => handleInputChange('skillExperience', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddSkill();
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., 3 years, Advanced"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  fullWidth
                  disabled={!formData.newSkill.trim() || !formData.skillExperience}
                  sx={{
                    height: isSmallMobile ? '40px' : '56px',
                    minWidth: 'auto',
                  }}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          

          {/* Skills List Section */}
          <Box
            sx={{
              border: darkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              p: 3,
              backgroundColor: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              minHeight: '250px',
              maxHeight: '400px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' }, // ✅ hides scrollbar but scroll still works
            }}
          >
            {errors.skills && (
              <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
                {errors.skills}
              </Alert>
            )}

            {skillCategories.map((category) => {
              const categorySkills = formData.skills.filter(skill => skill.category === category.value);
              if (categorySkills.length === 0) return null;

              return (
                <Box key={category.value} sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      color: 'primary.main',
                      fontSize: '1rem',
                      pb: 1,
                      borderBottom: darkMode
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {category.icon}
                    {category.label}
                    <Chip label={categorySkills.length} size="small" color="primary" variant="filled" />
                  </Typography>

                  <Grid container spacing={1}>
                    {categorySkills.map((skill, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={`${skill.name} (${skill.experience})`}
                          onDelete={() =>
                            handleRemoveSkill(
                              formData.skills.findIndex(
                                s => s.name === skill.name && s.category === skill.category
                              )
                            )
                          }
                          color="primary"
                          variant="outlined"
                          deleteIcon={<Delete />}
                          size={isSmallMobile ? "small" : "medium"}
                          sx={{
                            fontWeight: 'bold',
                            fontSize: isSmallMobile ? '0.8rem' : '0.9rem',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              backgroundColor: darkMode
                                ? 'rgba(144, 202, 249, 0.2)'
                                : 'rgba(25, 118, 210, 0.1)',
                            },
                            transition: 'all 0.2s',
                            backgroundColor: darkMode
                              ? 'rgba(144, 202, 249, 0.1)'
                              : 'transparent',
                            border: darkMode
                              ? '1px solid rgba(144, 202, 249, 0.3)'
                              : '1px solid rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}

            {formData.skills.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Code sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary" fontStyle="italic" gutterBottom>
                  No skills added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start building your skills profile by adding skills above!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Fade>
);







  // Step 4: Professional Experience
  const renderProfessionalExperience = () => (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: '1px solid',
            borderColor: darkMode ? '#3949ab' : '#90caf9',
            color: darkMode ? 'white' : 'inherit'
          }}
          icon={<Work />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Work Experience
          </Typography>
          Add your work experience in reverse chronological order. Include responsibilities, achievements, and technologies used.
        </Alert>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Work />
            Professional Experience
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() => addArrayItem('experiences', {
              jobTitle: '',
              company: '',
              startDate: '',
              endDate: '',
              location: '',
              responsibilities: '',
              achievements: '',
              technologies: '',
              currentlyWorking: false
            })}
            variant="outlined"
            color="primary"
            size={isSmallMobile ? "small" : "medium"}
          >
            Add Experience
          </Button>
        </Box>

        {formData.experiences.map((exp, index) => (
          <Zoom in={true} timeout={500} key={index}>
            <Paper sx={{
              p: 2,
              mb: 3,
              border: '2px solid',
              borderColor: 'primary.light',
              background: darkMode
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
              boxShadow: darkMode
                ? '0 4px 20px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  🏢 Experience #{index + 1}
                </Typography>
                {formData.experiences.length > 1 && (
                  <Tooltip title="Remove this experience">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeArrayItem('experiences', index)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => handleNestedArrayChange('experiences', index, 'jobTitle', e.target.value)}
                    error={!!errors[`experience_${index}_jobTitle`]}
                    helperText={errors[`experience_${index}_jobTitle`]}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Company Name"
                    value={exp.company}
                    onChange={(e) => handleNestedArrayChange('experiences', index, 'company', e.target.value)}
                    error={!!errors[`experience_${index}_company`]}
                    helperText={errors[`experience_${index}_company`]}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="e.g., Google Inc."
                  />
                </Grid>
                {/* Start Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleNestedArrayChange('experiences', index, 'startDate', e.target.value)
                    }
                    error={!!errors[`experience_${index}_startDate`]}
                    helperText={errors[`experience_${index}_startDate`]}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        filter: darkMode ? 'invert(0)' : 'invert(1)',
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleNestedArrayChange('experiences', index, 'endDate', e.target.value)
                    }
                    disabled={exp.currentlyWorking}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: exp.currentlyWorking ? (
                        <InputAdornment position="end">
                          <Chip label="Present" size="small" color="success" variant="filled" />
                        </InputAdornment>
                      ) : null,
                    }}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        filter: darkMode ? 'invert(0)' : 'invert(1)',
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          handleNestedArrayChange('experiences', index, 'currentlyWorking', e.target.checked);
                          if (e.target.checked) {
                            handleNestedArrayChange('experiences', index, 'endDate', '');
                          }
                        }}
                        color="primary"
                        size={isSmallMobile ? "small" : "medium"}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        color={exp.currentlyWorking ? 'success.main' : 'text.primary'}
                        fontWeight={exp.currentlyWorking ? 'bold' : 'normal'}
                      >
                        I currently work here
                      </Typography>
                    }
                  />
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={exp.location}
                    onChange={(e) => handleNestedArrayChange('experiences', index, 'location', e.target.value)}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="e.g., San Francisco, CA (Remote)"
                  />
                </Grid>

                {/* Responsibilities & Duties */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Responsibilities & Duties"
                    value={exp.responsibilities}
                    onChange={(e) =>
                      handleNestedArrayChange('experiences', index, 'responsibilities', e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    placeholder="Describe your main responsibilities..."
                    multiline
                    minRows={2}
                    maxRows={6}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 'auto',
                        fontSize: '0.9rem',
                      },
                      '& textarea': {
                        resize: 'none',
                        overflowY: 'auto', // 👈 scrollable
                        scrollbarWidth: 'none', // 👈 hides scrollbar (Firefox)
                        msOverflowStyle: 'none', // 👈 hides scrollbar (IE/Edge)
                        lineHeight: 1.5,
                        paddingTop: '6px',
                        paddingBottom: '6px',
                      },
                      '& textarea::-webkit-scrollbar': {
                        display: 'none', // 👈 hides scrollbar (Chrome/Safari)
                      },
                    }}
                  />
                </Grid>

                {/* Key Achievements & Contributions */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Key Achievements & Contributions"
                    value={exp.achievements}
                    onChange={(e) =>
                      handleNestedArrayChange('experiences', index, 'achievements', e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    placeholder="Highlight your key achievements..."
                    multiline
                    minRows={2}
                    maxRows={6}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 'auto',
                        fontSize: '0.9rem',
                      },
                      '& textarea': {
                        resize: 'none',
                        overflowY: 'auto', // 👈 allows scrolling
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        lineHeight: 1.5,
                        paddingTop: '6px',
                        paddingBottom: '6px',
                      },
                      '& textarea::-webkit-scrollbar': {
                        display: 'none', // 👈 hides scrollbar visually
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Technologies & Tools Used"
                    value={exp.technologies}
                    onChange={(e) => handleNestedArrayChange('experiences', index, 'technologies', e.target.value)}
                    variant="outlined"
                    size={isSmallMobile ? "small" : "medium"}
                    placeholder="e.g., React, Node.js, AWS, Python, MongoDB, Docker, Kubernetes..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        {formData.experiences.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Work sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" fontStyle="italic">
              No work experience added yet. Click "Add Experience" to get started!
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );



  // Step 5: Projects & Education
  const renderProjectsEducation = () => (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)'
              : 'linear-gradient(135deg, #e8f5e8 0%, #f0f4c3 100%)',
            border: '1px solid',
            borderColor: darkMode ? '#388e3c' : '#81c784',
            color: darkMode ? 'white' : 'inherit'
          }}
          icon={<School />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Projects & Education
          </Typography>
          Showcase your projects and educational background to demonstrate your practical experience and qualifications.
        </Alert>

        {/* Projects Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 0 }}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description />
              Projects & Portfolio
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => addArrayItem('projects', {
                projectName: '',
                description: '',
                role: '',
                technologies: '',
                achievements: '',
                projectLink: ''
              })}
              variant="outlined"
              color="primary"
              size={isSmallMobile ? "small" : "medium"}
            >
              Add Project
            </Button>
          </Box>

          {formData.projects.map((project, index) => (
            <Zoom in={true} timeout={500} key={index}>
              <Paper sx={{
                p: 2,
                mb: 2,
                border: '2px solid',
                borderColor: 'secondary.light',
                background: darkMode
                  ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                  : 'linear-gradient(135deg, #fff8e1 0%, #f3e5f5 100%)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="subtitle1" color="secondary" fontWeight="bold">
                    🚀 Project #{index + 1}
                  </Typography>
                  {formData.projects.length > 1 && (
                    <Tooltip title="Remove this project">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeArrayItem('projects', index)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={project.projectName}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'projectName', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., E-commerce Platform, Mobile App, Data Analysis Tool"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Project Description"
                      value={project.description}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'description', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="Describe the project, its purpose, target audience, and key features..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Role & Responsibilities"
                      value={project.role}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'role', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Frontend Developer, Project Lead, Full-stack Developer"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Technologies & Tools Used"
                      value={project.technologies}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'technologies', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Achievements & Impact"
                      value={project.achievements}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'achievements', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="Describe the impact, results, and key achievements of this project..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Link (URL)"
                      value={project.projectLink}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'projectLink', e.target.value)}
                      error={!!errors[`project_${index}_link`]}
                      helperText={errors[`project_${index}_link`] || "Optional - Must be a valid URL if provided"}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="https://github.com/yourusername/project or https://yourproject.com"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          ))}

          {formData.projects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" fontStyle="italic">
                No projects added yet. Showcase your work by adding projects above!
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Education Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 0 }}>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              Education Background
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => addArrayItem('education', {
                degree: '',
                institution: '',
                university: '',
                startYear: '',
                endYear: '',
                location: '',
                currentlyStudying: false
              })}
              variant="outlined"
              color="primary"
              size={isSmallMobile ? "small" : "medium"}
            >
              Add Education
            </Button>
          </Box>

          {formData.education.map((edu, index) => (
            <Zoom in={true} timeout={500} key={index}>
              <Paper sx={{
                p: 2,
                mb: 2,
                border: '2px solid',
                borderColor: 'info.light',
                background: darkMode
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                  : 'linear-gradient(135deg, #e1f5fe 0%, #e8eaf6 100%)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="subtitle1" color="info.main" fontWeight="bold">
                    🎓 Education #{index + 1}
                  </Typography>
                  {formData.education.length > 1 && (
                    <Tooltip title="Remove this education">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeArrayItem('education', index)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Degree / Qualification"
                      value={edu.degree}
                      onChange={(e) => handleNestedArrayChange('education', index, 'degree', e.target.value)}
                      error={!!errors[`education_${index}_degree`]}
                      helperText={errors[`education_${index}_degree`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Institution Name"
                      value={edu.institution}
                      onChange={(e) => handleNestedArrayChange('education', index, 'institution', e.target.value)}
                      error={!!errors[`education_${index}_institution`]}
                      helperText={errors[`education_${index}_institution`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Massachusetts Institute of Technology"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="University / Department"
                      value={edu.university}
                      onChange={(e) => handleNestedArrayChange('education', index, 'university', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., School of Computer Science"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={edu.location}
                      onChange={(e) => handleNestedArrayChange('education', index, 'location', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Cambridge, Massachusetts"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Year"
                      type="number"
                      value={edu.startYear}
                      onChange={(e) => handleNestedArrayChange('education', index, 'startYear', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="YYYY"
                      inputProps={{ min: "1900", max: "2030" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Year"
                      type="number"
                      value={edu.endYear}
                      onChange={(e) => handleNestedArrayChange('education', index, 'endYear', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="YYYY"
                      disabled={edu.currentlyStudying}
                      inputProps={{ min: "1900", max: "2030" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={edu.currentlyStudying}
                          onChange={(e) => handleNestedArrayChange('education', index, 'currentlyStudying', e.target.checked)}
                          color="primary"
                          size={isSmallMobile ? "small" : "medium"}
                        />
                      }
                      label="Currently Studying"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          ))}

          {formData.education.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" fontStyle="italic">
                No education details added yet. Add your educational background above!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );

  // Step 6: Documents & Additional Details
  const renderDocumentsAdditional = () => (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
            border: '1px solid',
            borderColor: darkMode ? '#6d4c41' : '#ffb74d',
            color: darkMode ? 'white' : 'inherit'
          }}
          icon={<AttachFile />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Documents & Additional Information
          </Typography>
          Upload your resume and cover letter, then complete your profile with languages and hobbies.
        </Alert>

        {/* Documents Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Description />
            Required Documents
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: errors.resume ? 'error.main' : 'primary.main',
                  height: '100%',
                  background: errors.resume
                    ? (darkMode ? '#d32f2f20' : '#ffebee')
                    : (darkMode
                      ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
                      : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Description sx={{ mr: 1, color: errors.resume ? 'error.main' : 'primary.main' }} />
                    <Typography variant="h6" color={errors.resume ? 'error.main' : 'primary.main'}>
                      Resume / CV *
                    </Typography>
                  </Box>

                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="resume-upload"
                    type="file"
                    onChange={(e) => handleFileUpload('resume', e.target.files[0])}
                  />

                  <label htmlFor="resume-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={formData.resume ? <CheckCircle /> : <CloudUpload />}
                      fullWidth
                      color={errors.resume ? 'error' : 'primary'}
                      sx={{ mb: 2, height: '50px' }}
                      size={isSmallMobile ? "small" : "medium"}
                    >
                      {formData.resume ? 'Change Resume' : 'Upload Resume'}
                    </Button>
                  </label>

                  {formData.resume && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: darkMode ? 'success.dark' : 'success.light',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'success.light' : 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle fontSize="small" />
                        {formData.resume.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? 'success.light' : 'success.dark' }}>
                        {(formData.resume.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}

                  {errors.resume && (
                    <Alert severity="error" sx={{ mt: 1 }} icon={<Warning />}>
                      {errors.resume}
                    </Alert>
                  )}

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    📄 Max file size: 5MB | Accepted formats: PDF, DOC, DOCX
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{
                height: '100%',
                background: darkMode
                  ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                  : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachFile sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.primary">
                      Cover Letter
                    </Typography>
                  </Box>

                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="coverletter-upload"
                    type="file"
                    onChange={(e) => handleFileUpload('coverLetter', e.target.files[0])}
                  />

                  <label htmlFor="coverletter-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={formData.coverLetter ? <CheckCircle /> : <CloudUpload />}
                      fullWidth
                      sx={{ mb: 2, height: '50px' }}
                      size={isSmallMobile ? "small" : "medium"}
                    >
                      {formData.coverLetter ? 'Change Cover Letter' : 'Upload Cover Letter'}
                    </Button>
                  </label>

                  {formData.coverLetter && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: darkMode ? 'success.dark' : 'success.light',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'success.light' : 'success.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle fontSize="small" />
                        {formData.coverLetter.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? 'success.light' : 'success.dark' }}>
                        {(formData.coverLetter.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}

                  {errors.coverLetter && (
                    <Alert severity="error" sx={{ mt: 1 }} icon={<Warning />}>
                      {errors.coverLetter}
                    </Alert>
                  )}

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    📝 Optional - Help us understand your motivation for applying
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Languages Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Language />
            Languages
          </Typography>

          <Paper sx={{
            p: 2,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)'
              : 'linear-gradient(135deg, #e8f5e8 0%, #f0f4c3 100%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Language"
                  value={formData.newLanguage}
                  onChange={(e) => handleInputChange('newLanguage', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddLanguage();
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., Spanish, French, Mandarin"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                  <InputLabel>Proficiency Level</InputLabel>
                  <Select
                    value={formData.proficiency}
                    label="Proficiency Level"
                    onChange={(e) => handleInputChange('proficiency', e.target.value)}
                    variant="outlined"
                  >
                    {proficiencyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={handleAddLanguage}
                  fullWidth
                  disabled={!formData.newLanguage.trim()}
                  startIcon={<Add />}
                  sx={{ height: isSmallMobile ? '40px' : '56px' }}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {formData.languages.length > 0 && (
            <Grid container spacing={1}>
              {formData.languages.map((language, index) => (
                <Grid item key={index}>
                  <Chip
                    label={`${language.name} (${language.proficiency})`}
                    onDelete={() => handleRemoveLanguage(index)}
                    color="secondary"
                    variant="outlined"
                    deleteIcon={<Delete />}
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: darkMode ? 'rgba(244, 143, 177, 0.1)' : 'transparent'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Hobbies Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Interests />
            Hobbies & Interests
          </Typography>

          <Paper sx={{
            p: 2,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  label="Hobby/Interest"
                  value={formData.newHobby}
                  onChange={(e) => handleInputChange('newHobby', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddHobby();
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Interests color="primary" /></InputAdornment>,
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., Photography, Hiking, Reading, Gaming"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={handleAddHobby}
                  fullWidth
                  disabled={!formData.newHobby.trim()}
                  startIcon={<Add />}
                  sx={{ height: isSmallMobile ? '40px' : '56px' }}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {formData.hobbies.length > 0 && (
            <Grid container spacing={1}>
              {formData.hobbies.map((hobby, index) => (
                <Grid item key={index}>
                  <Chip
                    label={hobby}
                    onDelete={() => handleRemoveHobby(index)}
                    variant="outlined"
                    deleteIcon={<Delete />}
                    size={isSmallMobile ? "small" : "medium"}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Fade>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderProfessionalSummary();
      case 2:
        return renderSkills();
      case 3:
        return renderProfessionalExperience();
      case 4:
        return renderProjectsEducation();
      case 5:
        return renderDocumentsAdditional();
      case 6:
        return <ReviewSubmission formData={formData} errors={errors} handleInputChange={handleInputChange} darkMode={darkMode} />;
      default:
        return null;
    }
  };

  // Custom Step Icon with proper styling
  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;

    return (
      <Box
        sx={{
          backgroundColor: active ? 'primary.main' : completed ? 'primary.main' : 'grey.400',
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          zIndex: 1,
        }}
      >
        {completed ? <CheckCircle sx={{ fontSize: 16 }} /> : icon}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode ? '#121212' : '#f5f5f5',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1, sm: 3 } }}>

            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Fade in={true} timeout={800}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Hiring Form
                </Typography>
              </Fade>
              <Fade in={true} timeout={1000}>
                <Typography variant="h5" sx={{
                  color: 'text.primary',
                  mb: 2,
                  fontWeight: '300',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}>
                  Join Our Innovative Team
                </Typography>
              </Fade>
            </Box>

            {/* Progress Stepper */}
            <Fade in={true} timeout={1500}>
              <Card sx={{
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: darkMode ? '#1e1e1e' : 'white',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0,0,0,0.1)'
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  {/* Desktop Stepper */}
                  {!isMobile && (
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                      sx={{
                        mb: 4,
                        '& .MuiStepConnector-line': {
                          borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel
                            StepIconComponent={CustomStepIcon}
                            sx={{
                              '& .MuiStepLabel-label': {
                                fontWeight: activeStep === index ? 'bold' : 'normal',
                                color: activeStep === index ? 'primary.main' : 'text.secondary',
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                mt: 1
                              }
                            }}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  )}

                  {/* Mobile Stepper */}
                  {isMobile && (
                    <Box sx={{ mb: 4 }}>
                      <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        sx={{
                          mb: 2,
                          '& .MuiStepConnector-line': {
                            borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                          }
                        }}
                      >
                        {steps.map((label, index) => (
                          <Step key={label}>
                            <StepLabel
                              StepIconComponent={CustomStepIcon}
                              sx={{
                                '& .MuiStepLabel-label': {
                                  fontWeight: activeStep === index ? 'bold' : 'normal',
                                  color: activeStep === index ? 'primary.main' : 'text.secondary',
                                  fontSize: '1rem'
                                }
                              }}
                            >
                              {label}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                      <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Step {activeStep + 1} of {steps.length}
                      </Typography>
                    </Box>
                  )}

                  {/* Current Step Content */}
                  {getStepContent(activeStep)}

                  {/* Navigation Buttons */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 4,
                    gap: 2,
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "large"}
                      sx={{
                        minWidth: isMobile ? '100%' : 120,
                        borderRadius: 2
                      }}
                      startIcon={<KeyboardArrowLeft />}
                    >
                      Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        size={isSmallMobile ? "small" : "large"}
                        disabled={isSubmitting}
                        sx={{
                          minWidth: isMobile ? '100%' : 200,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                          boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)',
                          }
                        }}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircle />}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size={isSmallMobile ? "small" : "large"}
                        sx={{
                          minWidth: isMobile ? '100%' : 120,
                          borderRadius: 2
                        }}
                        endIcon={<KeyboardArrowRight />}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>

            {/* Progress Indicator */}
            <Fade in={true} timeout={2000}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={(activeStep + 1) / steps.length * 100}
                  size={isMobile ? 50 : 60}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    background: darkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                    borderRadius: '50%',
                    p: 1
                  }}
                />
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HiringForm;