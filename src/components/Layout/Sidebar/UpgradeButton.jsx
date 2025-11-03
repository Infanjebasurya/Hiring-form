import React from 'react';
import { Button } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';

const UpgradeButton = ({ onClick }) => {
  return (
    <Button
      fullWidth
      startIcon={<BoltIcon />}
      onClick={onClick}
      sx={{
        justifyContent: 'center',
        textTransform: 'none',
        borderRadius: 2,
        py: 1.2,
        px: 2,
        mb: 1,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
        color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
        fontSize: '0.9rem',
        fontWeight: '600',
        '&:hover': {
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}`,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      Upgrade Plan
    </Button>
  );
};

export default UpgradeButton;