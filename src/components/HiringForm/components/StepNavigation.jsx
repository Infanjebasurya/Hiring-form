import React from 'react';
import {
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CheckCircle
} from '@mui/icons-material';

const StepNavigation = ({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  isMobile = false,
  isSmallMobile = false
}) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      mt: 4,
      gap: 2,
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <Button
        disabled={activeStep === 0}
        onClick={onBack}
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

      {activeStep === totalSteps - 1 ? (
        <Button
          variant="contained"
          onClick={onSubmit}
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
          onClick={onNext}
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
  );
};

export default StepNavigation;