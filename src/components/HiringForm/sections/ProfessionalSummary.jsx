import React from 'react';
import { Box, TextField } from '@mui/material';
import { Description } from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert } from '../components/FormComponents';

const ProfessionalSummary = ({
  formData,
  errors,
  handleInputChange,
  darkMode = false,
  isMobile = false,
  isSmallMobile = false
}) => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          mt: 3,
          maxWidth: "1550px",
          mx: "auto",
          width: "100%",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <InfoAlert
          icon={<Description />}
          title="Professional Summary"
          darkMode={darkMode}
          severity="success"
        >
          Write a compelling professional summary that highlights your experience, strengths, and career objectives.
        </InfoAlert>

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
};

export default ProfessionalSummary;