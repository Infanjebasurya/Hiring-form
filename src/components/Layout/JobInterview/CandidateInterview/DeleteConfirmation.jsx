import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const DeleteConfirmation = ({ open, onClose, candidate, onSuccess, onError, apiService }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiService.deleteCandidateInterview(candidate.id);
      onSuccess(`Candidate "${candidate.name}" deleted successfully`);
      onClose();
    } catch (err) {
      onError('Failed to delete candidate');
      console.error('Error deleting candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Delete Candidate
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.error.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'error.main',
            }}
          >
            <DeleteIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {candidate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {candidate.position} • {candidate.email}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          Are you sure you want to delete this candidate? This action cannot be undone.
        </Typography>
        
        <Alert severity="warning">
          All interview data and notes will be permanently deleted.
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;