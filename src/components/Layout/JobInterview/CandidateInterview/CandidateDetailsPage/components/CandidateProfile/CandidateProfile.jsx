// src/components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/components/CandidateProfile/CandidateProfile.jsx

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Button,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  FileCopy as FileCopyIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';

const CandidateProfile = ({ 
  candidate, 
  onEdit, 
  onScheduleRound, 
  onDownloadResume, 
  onDownloadCoverLetter,
  onCopyEmail 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'success',
      'Scheduled': 'primary',
      'Pending Feedback': 'warning',
      'Cancelled': 'error',
      'Rescheduled': 'info',
      'Did Not Attend': 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Completed': <CheckCircleIcon />,
      'Scheduled': <ScheduleIcon />,
      'Pending Feedback': <AccessTimeIcon />,
      'Cancelled': <CancelIcon />,
      'Rescheduled': <CalendarIcon />,
    };
    return icons[status] || <HourglassEmptyIcon />;
  };

  const handleCopyEmail = () => {
    if (candidate.email && onCopyEmail) {
      navigator.clipboard.writeText(candidate.email);
      onCopyEmail(candidate.email);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      {/* Profile Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            fontSize: '2.5rem',
            bgcolor: 'primary.main',
            mb: 2,
            mx: 'auto'
          }}
        >
          {candidate.name?.charAt(0) || 'A'}
        </Avatar>
        <Typography variant="h5" fontWeight="700" gutterBottom>
          {candidate.name || 'Candidate Name'}
        </Typography>
        <Typography variant="body1" color="primary" fontWeight="600" gutterBottom>
          {candidate.position || 'Position'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`ID: ${candidate.candidateId || 'N/A'}`} size="small" variant="outlined" />
          <Chip label={`Job: ${candidate.jobId || 'N/A'}`} size="small" variant="outlined" color="info" />
          <Chip 
            label={candidate.status || 'Status'} 
            size="small" 
            color={getStatusColor(candidate.status)}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Candidate Details */}
      <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon fontSize="small" />
        Candidate Details
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            Candidate Name
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.name || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            Email
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight="500">{candidate.email || 'N/A'}</Typography>
            {candidate.email && (
              <Tooltip title="Copy email">
                <IconButton size="small" onClick={handleCopyEmail}>
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            Phone
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.phone || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            Applied Role
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.position || 'N/A'}</Typography>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Edit Candidate
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ScheduleIcon />}
          onClick={onScheduleRound}
        >
          Schedule New Round
        </Button>
      </Box>

      {/* Attachments */}
      <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
        <FileCopyIcon fontSize="small" />
        Attachments
      </Typography>
      <List dense sx={{ mb: 2 }}>
        {candidate.attachments?.map((attachment, index) => (
          <ListItem 
            key={index}
            sx={{ 
              bgcolor: 'background.default', 
              borderRadius: 1, 
              mb: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
            secondaryAction={
              <IconButton edge="end" onClick={attachment.type === 'Resume' ? onDownloadResume : onDownloadCoverLetter}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemIcon>
              <FileCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={attachment.name}
              secondary={`${attachment.type} • ${attachment.size} • ${attachment.uploadedDate}`}
            />
          </ListItem>
        )) || (
          <ListItem>
            <ListItemText primary="No attachments found" />
          </ListItem>
        )}
      </List>

      {/* Additional Info */}
      <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
        <WorkIcon fontSize="small" />
        Additional Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Experience
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.experience || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Location
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.location || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Source
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.source || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            Availability
          </Typography>
          <Typography variant="body2" fontWeight="500">{candidate.availability || 'N/A'}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Skills */}
      <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentIcon fontSize="small" />
        Skills
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {candidate.skills?.map((skill, index) => (
          <Chip key={index} label={skill} size="small" variant="outlined" />
        )) || <Typography variant="body2">No skills listed</Typography>}
      </Box>
    </Paper>
  );
};

CandidateProfile.defaultProps = {
  candidate: {},
  onEdit: () => {},
  onScheduleRound: () => {},
  onDownloadResume: () => {},
  onDownloadCoverLetter: () => {},
  onCopyEmail: () => {},
};

export default CandidateProfile;