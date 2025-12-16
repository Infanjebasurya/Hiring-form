import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';

const CandidateDetails = ({ open, onClose, candidate }) => {
  if (!candidate) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="600">
            Candidate Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={candidate.status}
              color={
                candidate.status === 'Completed' ? 'success' :
                candidate.status === 'Scheduled' ? 'primary' :
                candidate.status === 'Pending Feedback' ? 'warning' : 'default'
              }
              size="small"
            />
            <Chip
              label={`Rating: ${candidate.rating}/5`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  bgcolor: '#667eea',
                  mb: 2,
                  mx: 'auto'
                }}
              >
                {candidate.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {candidate.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {candidate.candidateId}
              </Typography>
              
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Email</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="500">
                        {candidate.email}
                      </Typography>
                      <Tooltip title="Copy email">
                        <IconButton size="small" onClick={() => copyToClipboard(candidate.email)}>
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Phone</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {candidate.phone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">Location</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {candidate.location || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Position Applied
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.position}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Current Round
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.currentRound}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Interviewer
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.interviewer}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Interview Date
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.interviewDate}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Experience
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.experience}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Source
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {candidate.source}
                    </Typography>
                  </Box>
                </Grid>

                {/* Skills */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {candidate.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Notes */}
                {candidate.notes && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      {candidate.notes}
                    </Typography>
                  </Grid>
                )}

                {/* Feedback */}
                {candidate.feedback && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Feedback
                    </Typography>
                    <Typography variant="body2">
                      {candidate.feedback}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {candidate.resumeLink && (
          <Button
            variant="contained"
            onClick={() => window.open(candidate.resumeLink, '_blank')}
          >
            View Resume
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CandidateDetails;