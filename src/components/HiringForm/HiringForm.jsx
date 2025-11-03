import React, { useState, useEffect } from 'react';
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
  Warning
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
      background: { default: '#121212', paper: '#1e1e1e' },
      text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
      divider: 'rgba(255, 255, 255, 0.12)',
    } : {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#f5f5f5', paper: '#ffffff' },
      text: { primary: '#000000', secondary: 'rgba(0, 0, 0, 0.6)' },
    }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
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
      mb: 4,
      '& .MuiStepLabel-root .Mui-completed': {
        color: darkMode ? '#90caf9' : '#1976d2',
      },
      '& .MuiStepLabel-root .Mui-active': {
        color: darkMode ? '#90caf9' : '#1976d2',
      },
      '& .MuiStepLabel-root .MuiStepIcon-text': {
        fill: darkMode ? '#121212' : '#ffffff',
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
    mt: 4,
    pt: 2,
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
          size={isSmallMobile ? "small" : "medium"}
          fullWidth={isMobile}
          sx={{
            borderColor: 'success.main',
            color: 'success.main',
            '&:hover': {
              backgroundColor: 'success.main',
              color: 'white',
            },
          }}
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
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
            },
          }}
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
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
            },
          }}
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
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      
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
    let hasErrors = false;
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
      
    } catch (error) {
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
          background: darkMode ? '#121212' : '#f5f5f5',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1, sm: 3 } }}>

            {/* Header with draft indicator */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Fade in={true} timeout={800}>
                <Box>
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
                    }}
                  >
                 Hiring Form
                  </Typography>
                  
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
              <Fade in={true} timeout={1200}>
                <Typography variant="body1" sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto'
                }}>
                  Complete all sections carefully. All fields marked with * are required. 
                  Your progress is automatically saved.
                </Typography>
              </Fade>
            </Box>

            {/* Stepper and Form Content */}
            <Fade in={true} timeout={1500}>
              <Card sx={{
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: darkMode ? '#1e1e1e' : 'white',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0,0,0,0.1)',
                overflow: 'visible'
              }}>
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