import React from 'react';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatArea = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: 3,
        width: '100%',
      }}
    >
      {/* Welcome Message */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #6366F1, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Ask me anything...
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Start a conversation and explore the possibilities of AI
          </Typography>
        </Box>
      </Box>

      {/* Input Area */}
      <Box sx={{ mt: 'auto' }}>
        <TextField
          fullWidth
          placeholder="Type your message here..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              borderRadius: 3,
              fontSize: '1rem',
              py: 1,
              '& fieldset': {
                borderColor: '#333',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  mx: 1,
                }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatArea;