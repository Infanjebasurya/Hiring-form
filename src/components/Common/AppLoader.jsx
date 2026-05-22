import React from 'react';
import { alpha, Box, CircularProgress, Paper, Stack, Typography, useTheme } from '@mui/material';

const AppLoader = ({
  message = 'Loading workspace...',
  subMessage = 'Preparing your dashboard',
  fullScreen = false,
  minHeight = 420,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: fullScreen ? '100vh' : minHeight,
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        p: 3,
        bgcolor: fullScreen ? 'background.default' : 'transparent',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 'min(100%, 360px)',
          p: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 18px 44px rgba(0,0,0,0.28)'
            : '0 18px 44px rgba(15,23,42,0.08)',
        }}
      >
        <Stack spacing={2.25} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.28 : 0.18)}`,
            }}
          >
            <CircularProgress size={30} thickness={4.5} />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {message}
            </Typography>
            {subMessage && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subMessage}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AppLoader;
