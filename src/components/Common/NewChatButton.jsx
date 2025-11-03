import React from 'react';
import { Button, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const NewChatButton = ({ onClick, onSearchClick }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 2 }}>
      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={onClick}
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderRadius: 2,
          py: 1,
          px: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
          color: (theme) => theme.palette.mode === 'dark' ? 'black' : 'white',
          fontSize: '0.9rem',
          fontWeight: '600',
          '& .MuiButton-startIcon': {
            marginRight: '8px',
            '& > *:first-of-type': {
              fontSize: '1.2rem',
            },
          },
          '&:hover': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'black',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}`,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        New Chat
      </Button>
      
      <IconButton
        onClick={onSearchClick}
        sx={{
          color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
          borderRadius: 2,
          width: 40,
          height: 40,
          '&:hover': {
            color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default NewChatButton;