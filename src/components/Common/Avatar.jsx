import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';

const Avatar = ({ icon, alt = 'Avatar', size = 32 }) => {
  return (
    <MuiAvatar
      sx={{
        bgcolor: 'primary.main',
        width: size,
        height: size,
        fontSize: '0.875rem',
        fontWeight: 'bold',
      }}
    >
      {icon}
    </MuiAvatar>
  );
};

export default Avatar;