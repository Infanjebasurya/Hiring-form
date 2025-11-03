import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check, Add } from '@mui/icons-material';

const ProjectsSection = () => {
  return (
    <Box sx={{ mb: 2 }}>
      {/* Section Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2, 
        py: 1 
      }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            fontSize: '0.875rem',
          }}
        >
          Projects
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Check sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Add sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
      </Box>

      {/* Empty Projects Message */}
      <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          No projects to show
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectsSection;