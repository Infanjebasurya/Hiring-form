import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CheckCircle,
  Warning,
  BusinessCenter,
  Description,
  Save
} from '@mui/icons-material';
import { alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';

// Import sections
import PersonalInfo from './sections/PersonalInfo';
import ProfessionalSummary from './sections/ProfessionalSummary';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsEducation from './sections/ProjectsEducation';
import DocumentsAdditional from './sections/DocumentsAdditional';
import ReviewSubmission from './sections/ReviewSubmission';

// Import validation
import { validateStep, validateField } from './utils/validation';

// Theme configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
      secondary: { main: '#14b8a6', light: '#2dd4bf', dark: '#0f766e' },
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      info: { main: '#38bdf8' },
      background: { default: '#0b1020', paper: '#111827' },
      text: { primary: '#f8fafc', secondary: 'rgba(226, 232, 240, 0.72)' },
      divider: 'rgba(148, 163, 184, 0.16)',
    } : {
      primary: { main: '#4f46e5', light: '#6366f1', dark: '#3730a3' },
      secondary: { main: '#0f766e', light: '#14b8a6', dark: '#115e59' },
      success: { main: '#059669' },
      warning: { main: '#d97706' },
      error: { main: '#dc2626' },
      info: { main: '#0284c7' },
      background: { default: '#f5f7fb', paper: '#ffffff' },
      text: { primary: '#111827', secondary: '#64748b' },
      divider: 'rgba(15, 23, 42, 0.1)',
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 700,
          minHeight: 40,
          letterSpacing: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.64)' : '#ffffff',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.14)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${alpha(mode === 'dark' ? '#818cf8' : '#4f46e5', 0.12)}`,
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#818cf8' : '#4f46e5',
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Custom Stepper Component
const CustomStepper = ({ activeStep, steps, darkMode, isMobile }) => (
  <Stepper
    activeStep={activeStep} 
    sx={{ 
      mb: 3,
      px: { xs: 0, md: 1 },
      '& .MuiStepLabel-root .Mui-completed': {
        color: darkMode ? '#a5b4fc' : '#4f46e5',
      },
      '& .MuiStepLabel-root .Mui-active': {
        color: darkMode ? '#a5b4fc' : '#4f46e5',
      },
      '& .MuiStepLabel-label': {
        fontWeight: 700,
        color: 'text.secondary',
      },
      '& .MuiStepLabel-label.Mui-active': {
        color: 'text.primary',
      },
      '& .MuiStepLabel-root .MuiStepIcon-text': {
        fill: darkMode ? '#121212' : '#ffffff',
      },
      '& .MuiStepConnector-line': {
        borderColor: 'divider',
      },
    }}
    orientation={isMobile ? "vertical" : "horizontal"}
  >
    {steps.map((label, index) => (
      <Step key={label}>
        <StepLabel>
          {isMobile ? `${index + 1}. ${label}` : label}
        </StepLabel>
      </Step>
    ))}
  </Stepper>
);

// Step Navigation Component
const StepNavigation = ({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  isMobile,
  isSmallMobile,
  onSaveDraft
}) => (
  <Box sx={{
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    mt: 3,
    pt: 2.5,
    borderTop: '1px solid',
    borderColor: 'divider',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? 2 : 0
  }}>
    <Button
      variant="outlined"
      onClick={onBack}
      disabled={activeStep === 0 || isSubmitting}
      startIcon={<KeyboardArrowLeft />}
      size={isSmallMobile ? "small" : "medium"}
      fullWidth={isMobile}
    >
      Back
    </Button>

    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      width: isMobile ? '100%' : 'auto',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* Save Draft Button - Show on all steps except last */}
      {activeStep !== totalSteps - 1 && (
        <Button
          variant="outlined"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          startIcon={<Save />}
          size={isSmallMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Save Draft
        </Button>
      )}

      {activeStep === totalSteps - 1 ? (
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={16} /> : <CheckCircle />}
          size={isSmallMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={onNext}
          endIcon={<KeyboardArrowRight />}
          size={isSmallMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          Next
        </Button>
      )}
    </Box>
  </Box>
);

// Initial form data
const getInitialFormData = () => ({
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

  // Skills
  newSkill: '',
  skillExperience: '',
  skillCategory: 'technical',
  skills: [],

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

// Storage keys
const STORAGE_KEYS = {
  FORM_DATA: 'hiring_form_data',
  CURRENT_STEP: 'hiring_form_current_step',
  FORM_TIMESTAMP: 'hiring_form_timestamp'
};

const HiringForm = ({ darkMode = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasUnsavedData, setHasUnsavedData] = useState(false);

  // Create theme based on darkMode prop
  const theme = React.useMemo(() =>
    createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize form data from localStorage or use default
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Merge with initial data to ensure all fields exist
        return { ...getInitialFormData(), ...parsedData };
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return getInitialFormData();
  });

  // Initialize active step from localStorage
  React.useEffect(() => {
    try {
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 0 && step < steps.length) {
          setActiveStep(step);
        }
      }
    } catch (error) {
      console.error('Error loading saved step:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for unsaved data on component mount
  React.useEffect(() => {
    checkForSavedData();
  }, []);

  // Save form data to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, activeStep.toString());
      localStorage.setItem(STORAGE_KEYS.FORM_TIMESTAMP, new Date().toISOString());
      setHasUnsavedData(true);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData, activeStep]);

  const steps = [
    'Personal Info',
    'Professional Summary',
    'Experience & Skills',
    'Projects & Education',
    'Documents & Additional',
    'Review & Submit'
  ];
  const progressValue = Math.round((activeStep + 1) / steps.length * 100);

  const checkForSavedData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      
      if (savedData && savedStep) {
        const parsedData = JSON.parse(savedData);
        const hasData = Object.values(parsedData).some(value => {
          if (Array.isArray(value)) {
            return value.length > 0 || value.some(item => 
              Object.values(item).some(fieldValue => 
                fieldValue && fieldValue.toString().trim() !== ''
              )
            );
          }
          return value && value.toString().trim() !== '';
        });
        
        if (hasData) {
          setShowRestoreDialog(true);
        }
      }
    } catch (error) {
      console.error('Error checking for saved data:', error);
    }
  };

  const handleRestoreData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData({ ...getInitialFormData(), ...parsedData });
      }
      
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 0 && step < steps.length) {
          setActiveStep(step);
        }
      }
      
      setShowRestoreDialog(false);
      setSnackbar({
        open: true,
        message: 'Your previous form data has been restored!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error restoring data:', error);
      setSnackbar({
        open: true,
        message: 'Error restoring your data. Please start fresh.',
        severity: 'error'
      });
    }
  };

  const handleDiscardData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.FORM_TIMESTAMP);
      setFormData(getInitialFormData());
      setActiveStep(0);
      setShowRestoreDialog(false);
      setHasUnsavedData(false);
      setSnackbar({
        open: true,
        message: 'Starting fresh application...',
        severity: 'info'
      });
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, activeStep.toString());
      localStorage.setItem(STORAGE_KEYS.FORM_TIMESTAMP, new Date().toISOString());
      
      setSnackbar({
        open: true,
        message: 'Draft saved successfully! You can return anytime to continue.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      setSnackbar({
        open: true,
        message: 'Error saving draft. Please check your browser storage.',
        severity: 'error'
      });
    }
  };

  // Enhanced validation function
  const validateCurrentStep = () => {
    const stepErrors = validateStep(activeStep, formData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSnackbar({
        open: true,
        message: 'Please fix the validation errors before proceeding',
        severity: 'error'
      });
      // Scroll to first error
      const firstErrorField = document.querySelector('[error]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value, formData);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate on blur
    const error = validateField(field, formData[field], formData);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleNestedArrayChange = (arrayName, index, field, value) => {
    const fieldKey = `${arrayName}_${index}_${field}`;
    
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));

    // Real-time validation for touched nested fields
    if (touched[fieldKey]) {
      const error = validateField(fieldKey, value, formData);
      setErrors(prev => ({
        ...prev,
        [fieldKey]: error
      }));
    }
  };

  const handleNestedBlur = (arrayName, index, field) => {
    const fieldKey = `${arrayName}_${index}_${field}`;
    setTouched(prev => ({
      ...prev,
      [fieldKey]: true
    }));

    const value = formData[arrayName][index][field];
    const error = validateField(fieldKey, value, formData);
    setErrors(prev => ({
      ...prev,
      [fieldKey]: error
    }));
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

    // Clean up errors for removed item
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith(`${arrayName}_${index}_`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const handleFileUpload = (field, file) => {
    // Basic file validation
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [field]: 'File size must be less than 5MB'
        }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [field]: 'File must be PDF, DOC, or DOCX format'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Clear file error if any
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, {
          name: formData.newSkill.trim(),
          experience: formData.skillExperience,
          category: formData.skillCategory
        }],
        newSkill: '',
        skillExperience: ''
      }));
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
          language: formData.newLanguage.trim(),
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

  const submitFormData = async (formData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', formData);
        resolve();
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    const allErrors = {};

    for (let step = 0; step < steps.length; step++) {
      const stepErrors = validateStep(step, formData);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setSnackbar({
        open: true,
        message: 'Please fix all validation errors before submitting',
        severity: 'error'
      });
      setActiveStep(0); // Go back to first step to show errors
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFormData(formData);
      setSnackbar({
        open: true,
        message: 'Application submitted successfully! We will review your application and contact you soon.',
        severity: 'success'
      });
      
      // Clear saved data after successful submission
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
        localStorage.removeItem(STORAGE_KEYS.FORM_TIMESTAMP);
        
        setFormData(getInitialFormData());
        setActiveStep(0);
        setErrors({});
        setTouched({});
        setHasUnsavedData(false);
      }, 2000);
      
    } catch {
      setSnackbar({
        open: true,
        message: 'Submission failed. Please check your connection and try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get step content with enhanced props
  const getStepContent = (step) => {
    const commonProps = {
      formData,
      errors,
      touched,
      handleInputChange,
      handleNestedArrayChange,
      handleBlur,
      handleNestedBlur,
      addArrayItem,
      removeArrayItem,
      handleFileUpload,
      handleAddSkill,
      handleRemoveSkill,
      handleAddLanguage,
      handleRemoveLanguage,
      handleAddHobby,
      handleRemoveHobby,
      darkMode,
      isMobile,
      isSmallMobile
    };

    switch (step) {
      case 0:
        return <PersonalInfo {...commonProps} />;
      case 1:
        return <ProfessionalSummary {...commonProps} />;
      case 2:
        return <ExperienceSection {...commonProps} />;
      case 3:
        return <ProjectsEducation {...commonProps} />;
      case 4:
        return <DocumentsAdditional {...commonProps} />;
      case 5:
        return <ReviewSubmission {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode
            ? 'radial-gradient(circle at top right, rgba(129, 140, 248, 0.14), transparent 28rem), #0b1020'
            : 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.10), transparent 30rem), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          py: { xs: 2, md: 3 }
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 0.5, sm: 2 } }}>

            {/* Header with draft indicator */}
            <Box
              sx={{
                mb: 2.5,
                p: { xs: 2, md: 3 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.background.paper, darkMode ? 0.86 : 0.98),
                boxShadow: darkMode ? '0 20px 56px rgba(0,0,0,0.28)' : '0 20px 56px rgba(15,23,42,0.08)',
                textAlign: 'left',
              }}
            >
              <Fade in={true} timeout={800}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        color: 'primary.main',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        flexShrink: 0,
                      }}
                    >
                      <BusinessCenter />
                    </Box>
                    <Box>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 800,
                      lineHeight: 1.15,
                      color: 'text.primary',
                    }}
                  >
                 Hiring Form
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
                    Complete a structured candidate profile for review. Draft progress is saved automatically as you work.
                  </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      minWidth: { md: 230 },
                      p: 1.5,
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) => alpha(theme.palette.background.default, darkMode ? 0.48 : 0.72),
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                        APPLICATION PROGRESS
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                        {progressValue}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress variant="determinate" value={progressValue} size={38} thickness={5} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          Step {activeStep + 1} of {steps.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hasUnsavedData ? 'Draft saved' : 'Ready to start'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* {hasUnsavedData && (
                    <Fade in={hasUnsavedData}>
                      <Alert 
                        severity="info" 
                        sx={{ 
                          maxWidth: 400, 
                          mx: 'auto', 
                          mb: 2,
                          '& .MuiAlert-message': {
                            fontSize: '0.875rem'
                          }
                        }}
                        icon={<CheckCircle />}
                      >
                        Your progress is automatically saved
                      </Alert>
                    </Fade>
                  )} */}
                </Box>
              </Fade>
            </Box>

            {/* Stepper and Form Content */}
            <Fade in={true} timeout={1500}>
              <Card
                elevation={0}
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: darkMode ? '0 18px 48px rgba(0,0,0,0.24)' : '0 18px 48px rgba(15,23,42,0.07)',
                  background: 'background.paper',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, position: 'relative' }}>
                  
                  {/* Validation Error Alert */}
                  {Object.keys(errors).length > 0 && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 2 }}
                      onClose={() => setErrors({})}
                    >
                      Please fix {Object.keys(errors).length} validation error(s) before proceeding
                    </Alert>
                  )}

                  <Box
                    sx={{
                      mb: 2.5,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                    }}
                  >
                    <Description color="primary" />
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>
                        {steps[activeStep]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Section {activeStep + 1} of {steps.length}
                      </Typography>
                    </Box>
                  </Box>

                  <CustomStepper
                    activeStep={activeStep}
                    steps={steps}
                    darkMode={darkMode}
                    isMobile={isMobile}
                  />

                  {/* Current Step Content */}
                  <Box sx={{ minHeight: 400 }}>
                    {getStepContent(activeStep)}
                  </Box>

                  {/* Navigation Buttons */}
                  <StepNavigation
                    activeStep={activeStep}
                    totalSteps={steps.length}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    onSaveDraft={handleSaveDraft}
                    isSubmitting={isSubmitting}
                    isMobile={isMobile}
                    isSmallMobile={isSmallMobile}
                  />
                </CardContent>
              </Card>
            </Fade>

            {/* Progress Indicator */}
            <Fade in={true} timeout={2000}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Step {activeStep + 1} of {steps.length} • {Math.round((activeStep + 1) / steps.length * 100)}% Complete
                  {hasUnsavedData && ' • Draft Saved'}
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

        {/* Restore Data Dialog */}
        <Dialog
          open={showRestoreDialog}
          onClose={() => setShowRestoreDialog(false)}
          aria-labelledby="restore-dialog-title"
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <DialogTitle id="restore-dialog-title">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color="warning" />
              Unsaved Application Found
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              We found an incomplete application from your previous session. 
              Would you like to restore your progress or start a new application?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDiscardData} color="error">
              Start New
            </Button>
            <Button onClick={handleRestoreData} variant="contained" autoFocus>
              Restore My Data
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default HiringForm;
