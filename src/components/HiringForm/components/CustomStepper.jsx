import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';

const CustomStepper = ({
  activeStep,
  steps,
  darkMode = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Custom Step Icon
  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;

    return (
      <Box
        sx={{
          backgroundColor: active ? 'primary.main' : completed ? 'primary.main' : 'grey.400',
          width: isSmallMobile ? 20 : 24,
          height: isSmallMobile ? 20 : 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: isSmallMobile ? '0.75rem' : '0.875rem',
          fontWeight: 'bold',
          zIndex: 1,
          transition: 'all 0.3s ease',
        }}
      >
        {completed ? <CheckCircle sx={{ fontSize: isSmallMobile ? 14 : 16 }} /> : icon}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Horizontal Stepper for ALL devices */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 2,
          '& .MuiStepConnector-line': {
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            borderTopWidth: isSmallMobile ? 1 : 2,
          },
          '& .MuiStepConnector-root': {
            padding: isSmallMobile ? '0 4px' : '0 8px',
          },
          overflow: 'auto', // Allow horizontal scrolling on very small screens
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
                  fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
                  mt: isSmallMobile ? 0.5 : 1,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: isSmallMobile ? 80 : 100,
                },
                padding: isSmallMobile ? '0 4px' : '0 8px',
              }}
            >
              {isSmallMobile ? 
                label
                  .replace('&', '&')
                  .split(' ')
                  .map(word => word.charAt(0))
                  .join('') 
                : label
              }
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Current Step Indicator */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          color="primary.main"
          sx={{ 
            fontWeight: 'bold',
            fontSize: isSmallMobile ? '0.8rem' : '0.9rem',
            mb: 0.5
          }}
        >
          {steps[activeStep]}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.75rem' }}
        >
          Step {activeStep + 1} of {steps.length}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          width: '100%',
          height: 4,
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          mt: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${((activeStep + 1) / steps.length) * 100}%`,
            height: '100%',
            backgroundColor: 'primary.main',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomStepper;