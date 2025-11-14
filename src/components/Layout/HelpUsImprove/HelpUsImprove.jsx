// src/components/Layout/HelpUsImprove/HelpUsImprove.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Feedback as FeedbackIcon } from '@mui/icons-material';

const HelpUsImprove = ({ open, onClose, darkMode }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your feedback before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - replace with your actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the feedback to your backend
      console.log('Feedback submitted:', feedback);
      
      setSubmitStatus({ type: 'success', message: 'Thank you for your feedback! We appreciate your input.' });
      setFeedback('');
      
      // Close dialog after successful submission
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFeedback('');
    setSubmitStatus(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? 'background.paper' : 'background.default',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FeedbackIcon color="primary" />
          <Typography variant="h6" component="span">
            Help Us Improve
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We value your feedback! Please share your thoughts, suggestions, or report any issues you've encountered.
          </Typography>

          {submitStatus && (
            <Alert 
              severity={submitStatus.type} 
              sx={{ mb: 2 }}
            >
              {submitStatus.message}
            </Alert>
          )}

          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            label="Your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think... What can we do better? What features would you like to see? Any issues you've faced?"
            disabled={isSubmitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: darkMode ? 'background.default' : 'background.paper',
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            disabled={isSubmitting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !feedback.trim()}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HelpUsImprove;