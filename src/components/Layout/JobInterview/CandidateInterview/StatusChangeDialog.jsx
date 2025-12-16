import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
} from '@mui/material';

const StatusChangeDialog = ({ 
  open, 
  onClose, 
  candidate, 
  onSuccess, 
  onError, 
  apiService,
  availableStatuses 
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (candidate) {
      setNewStatus(candidate.status);
    }
  }, [candidate]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiService.updateCandidateStatus(candidate.id, newStatus);
      onSuccess(`Status updated to ${newStatus} for ${candidate.name}`);
      onClose();
    } catch (err) {
      onError('Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Pending Feedback': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

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
        Change Candidate Status
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#667eea' }}>
            {candidate.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              {candidate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Status: <Box component="span" sx={{ color: `${getStatusColor(candidate.status)}.main`, fontWeight: 600 }}>
                {candidate.status}
              </Box>
            </Typography>
          </Box>
        </Box>
        
        <FormControl fullWidth>
          <InputLabel>New Status</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="New Status"
          >
            {availableStatuses.map((status) => (
              <MenuItem 
                key={status} 
                value={status}
                sx={{ color: `${getStatusColor(status)}.main` }}
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !newStatus || newStatus === candidate.status}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeDialog;