// src/components/JobInterview/EditJobInterview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Autocomplete,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const EditJobInterview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    jobId: '',
    jdLink: '',
    interviewRounds: [],
  });
  
  const [newRoundName, setNewRoundName] = useState('');
  const [originalData, setOriginalData] = useState(null);
  
  // Interviewers list
  const [interviewersList] = useState([
    'John Doe (john@company.com)',
    'Jane Smith (jane@company.com)',
    'Bob Johnson (bob@company.com)',
    'Alice Brown (alice@company.com)',
    'Rajesh R (rajesh@company.com)',
    'Sarah Williams (sarah@company.com)',
    'Mike Chen (mike@company.com)',
  ]);

  // Fetch job data
  useEffect(() => {
    fetchJobData();
  }, [id, location]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check location state first (for edit from table)
      if (location.state?.editData) {
        const editData = location.state.editData;
        setFormData({
          id: editData.id,
          jobId: editData.jobId || '',
          jdLink: editData.jdLink || '',
          interviewRounds: editData.interviewRounds || [],
        });
        setOriginalData(editData);
      } else if (id) {
        // Try to parse id
        const jobId = parseInt(id);
        
        if (isNaN(jobId)) {
          throw new Error('Invalid job ID');
        }
        
        // Fetch from localStorage
        const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
        const job = data.find(item => item.id === jobId);
        
        if (job) {
          setFormData({
            id: job.id,
            jobId: job.jobId || '',
            jdLink: job.jdLink || '',
            interviewRounds: job.interviewRounds || [],
          });
          setOriginalData(job);
        } else {
          throw new Error('Job interview not found');
        }
      } else {
        throw new Error('No job interview selected');
      }
    } catch (err) {
      setError(err.message || 'Failed to load job interview data');
      console.error('Error fetching job data:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.jobId !== originalData.jobId ||
      formData.jdLink !== originalData.jdLink ||
      JSON.stringify(formData.interviewRounds) !== JSON.stringify(originalData.interviewRounds)
    );
  };

  const handleBack = () => {
    if (hasChanges()) {
      setShowExitDialog(true);
    } else {
      navigate('/job-interviews');
    }
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    navigate('/job-interviews');
  };

  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  const handleAddRound = () => {
    if (!newRoundName.trim()) {
      setError('Please enter a round name');
      return;
    }
    
    const newRound = {
      id: Date.now(),
      name: newRoundName,
      interviewer: '',
      isSelfAssigned: false,
    };
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: [...prev.interviewRounds, newRound]
    }));
    setNewRoundName('');
    setError('');
  };

  const handleDeleteRound = (roundId) => {
    if (formData.interviewRounds.length <= 1) {
      setError('At least one interview round is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter(round => round.id !== roundId)
    }));
  };

  const handleRoundNameChange = (roundId, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { ...round, name: value } : round
      )
    }));
  };

  const handleInterviewerChange = (roundId, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { 
          ...round, 
          interviewer: value,
          isSelfAssigned: value === 'Rajesh R (rajesh@company.com)' 
        } : round
      )
    }));
  };

  const handleSelfAssign = (roundId) => {
    const selfInterviewer = 'Rajesh R (rajesh@company.com)';
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === roundId ? { 
          ...round, 
          interviewer: selfInterviewer,
          isSelfAssigned: true 
        } : round
      )
    }));
  };

  const validateForm = () => {
    // Validate Job ID
    if (!formData.jobId.trim()) {
      setError('Job ID is required');
      return false;
    }

    // Validate each round has a name
    for (const round of formData.interviewRounds) {
      if (!round.name.trim()) {
        setError('All interview rounds must have a name');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');

      // Prepare updated data
      const updatedData = {
        ...formData,
        rounds: formData.interviewRounds.length,
        updatedAt: new Date().toISOString(),
      };

      // Update in localStorage
      const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      const updatedIndex = data.findIndex(item => item.id === formData.id);
      
      if (updatedIndex !== -1) {
        // Preserve other properties from original data
        data[updatedIndex] = {
          ...data[updatedIndex],
          ...updatedData
        };
        
        localStorage.setItem('jobInterviews', JSON.stringify(data));
        
        setSuccess(true);
        setOriginalData(data[updatedIndex]);
        
        // Navigate back after success
        setTimeout(() => {
          navigate('/job-interviews');
        }, 1500);
      } else {
        throw new Error('Job interview not found in database');
      }

    } catch (err) {
      setError(err.message || 'Failed to update job interview. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.id) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        bgcolor: '#f5f5f5'
      }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/job-interviews')}
          sx={{ mt: 2 }}
        >
          Back to Job Interviews
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1200px',
      margin: '0 auto', 
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={handleExitCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: '#fff',
          },
        }}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to leave?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleExitCancel} 
            sx={{ 
              borderRadius: 2, 
              px: 3,
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExitConfirm}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: { xs: 3, sm: 4 },
        gap: 2 
      }}>
        <IconButton 
          onClick={handleBack}
          disabled={saving}
          sx={{ 
            p: { xs: 1, sm: 1.5 },
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            bgcolor: '#fff',
            '&:hover': {
              bgcolor: '#f5f5f5'
            }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Edit Interview Process
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Job ID: {formData.jobId}
          </Typography>
        </Box>
        {hasChanges() && (
          <Chip 
            label="Unsaved Changes" 
            color="warning" 
            size="small"
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Interview process updated successfully! Redirecting...
        </Alert>
      )}

      {/* Main Content Container */}
      <Box sx={{ 
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Job ID Section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}
          >
            Job ID
          </Typography>
          <TextField
            fullWidth
            value={formData.jobId}
            onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
            disabled={saving}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: '#fff',
                '& input': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                  padding: { xs: '12px 14px', sm: '14px 16px' }
                }
              }
            }}
          />
        </Box>

        {/* JD Link Section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}
          >
            JD Link
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter job description link"
            value={formData.jdLink}
            onChange={(e) => setFormData(prev => ({ ...prev, jdLink: e.target.value }))}
            disabled={saving}
            InputProps={{
              startAdornment: (
                <LinkIcon sx={{ 
                  mr: 1.5, 
                  color: '#666',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: '#fff',
                '& input': {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  padding: { xs: '12px 14px', sm: '14px 16px' }
                }
              }
            }}
          />
        </Box>

        <Divider sx={{ 
          my: { xs: 3, sm: 4 },
          borderColor: '#e0e0e0',
          borderWidth: '1px'
        }} />

        {/* Interview Rounds Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Interview Rounds ({formData.interviewRounds.length})
          </Typography>

          {/* Existing Rounds */}
          {formData.interviewRounds.map((round, index) => (
            <Paper
              key={round.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                bgcolor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
              }}
            >
              {/* Round Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mr: 2,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    minWidth: '60px'
                  }}
                >
                  Round {index + 1}
                </Typography>
                
                <TextField
                  value={round.name}
                  onChange={(e) => handleRoundNameChange(round.id, e.target.value)}
                  placeholder="Enter round name"
                  fullWidth
                  size="small"
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      bgcolor: '#f8f9fa',
                    }
                  }}
                />
                
                {formData.interviewRounds.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRound(round.id)}
                    disabled={saving}
                    sx={{ 
                      ml: 'auto', 
                      color: '#666',
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                )}
              </Box>

              {/* Assign Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    minWidth: { xs: '100%', sm: '60px' },
                    mb: isMobile ? 1 : 0,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Assign
                </Typography>
                
                <Autocomplete
                  freeSolo
                  size="small"
                  options={interviewersList}
                  value={round.interviewer}
                  onChange={(event, newValue) => handleInterviewerChange(round.id, newValue)}
                  onInputChange={(event, newInputValue) => handleInterviewerChange(round.id, newInputValue)}
                  disabled={saving}
                  sx={{ 
                    flexGrow: 1,
                    minWidth: { xs: '100%', sm: '200px' },
                    '& .MuiAutocomplete-inputRoot': {
                      padding: { xs: '4px 8px', sm: '8px 12px' },
                      bgcolor: '#f8f9fa',
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type or select interviewer"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '6px',
                        }
                      }}
                    />
                  )}
                />

                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 },
                  width: { xs: '100%', sm: 'auto' },
                  mt: isMobile ? 1 : 0
                }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleInterviewerChange(round.id, '')}
                    disabled={saving}
                    sx={{
                      borderRadius: '6px',
                      textTransform: 'none',
                      borderColor: '#666',
                      color: '#666',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      '&:hover': {
                        borderColor: '#333',
                        color: '#333',
                      }
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant={round.isSelfAssigned ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleSelfAssign(round.id)}
                    disabled={saving}
                    sx={{
                      borderRadius: '6px',
                      textTransform: 'none',
                      minWidth: { xs: '70px', sm: '80px' },
                      borderColor: round.isSelfAssigned ? '#1976d2' : '#666',
                      bgcolor: round.isSelfAssigned ? '#1976d2' : 'transparent',
                      color: round.isSelfAssigned ? '#fff' : '#666',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      '&:hover': {
                        borderColor: round.isSelfAssigned ? '#1565c0' : '#333',
                        bgcolor: round.isSelfAssigned ? '#1565c0' : 'transparent',
                        color: round.isSelfAssigned ? '#fff' : '#333',
                      }
                    }}
                  >
                    Self
                  </Button>
                </Box>
              </Box>

              {/* Assigned Interviewer Display */}
              {round.interviewer && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 2, 
                  ml: { xs: 0, sm: '68px' },
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {round.isSelfAssigned ? 'Self' : 'Assigned'}:
                  </Typography>
                  <Chip
                    label={round.interviewer}
                    size="small"
                    onDelete={round.isSelfAssigned ? undefined : () => handleInterviewerChange(round.id, '')}
                    sx={{
                      bgcolor: round.isSelfAssigned ? '#e3f2fd' : '#f0f0f0',
                      color: round.isSelfAssigned ? '#1976d2' : '#333',
                      fontWeight: 500,
                      borderRadius: '4px',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      height: { xs: '24px', sm: '28px' },
                      '& .MuiChip-deleteIcon': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          ))}

          {/* Add New Round Section */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 3 }, 
            alignItems: 'center', 
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              fullWidth
              placeholder="Enter new round name"
              value={newRoundName}
              onChange={(e) => setNewRoundName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRound()}
              disabled={saving}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: '#fff',
                  '& input': {
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    padding: { xs: '12px 14px', sm: '14px 16px' }
                  }
                }
              }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRound}
              disabled={saving}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                minWidth: { xs: '100%', sm: '200px' },
                borderColor: '#666',
                color: '#666',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                bgcolor: '#fff',
                '&:hover': {
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  bgcolor: '#f8f9fa',
                }
              }}
            >
              Add Interview Round
            </Button>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: { xs: 3, sm: 4 },
          width: '100%',
          gap: 2
        }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleBack}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderColor: '#666',
              color: '#666',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              bgcolor: '#fff',
              '&:hover': {
                borderColor: '#333',
                color: '#333',
              }
            }}
          >
            Cancel
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                if (originalData) {
                  setFormData({
                    id: originalData.id,
                    jobId: originalData.jobId || '',
                    jdLink: originalData.jdLink || '',
                    interviewRounds: originalData.interviewRounds || [],
                  });
                  setError('');
                }
              }}
              disabled={saving || !hasChanges()}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                borderColor: '#666',
                color: '#666',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                bgcolor: '#fff',
                '&:hover': {
                  borderColor: '#333',
                  color: '#333',
                }
              }}
            >
              Reset
            </Button>
            
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || success || !hasChanges()}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.25 },
                bgcolor: '#1976d2',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': {
                  bgcolor: '#1565c0',
                },
                '&:disabled': {
                  bgcolor: '#1976d2',
                  opacity: 0.7
                }
              }}
            >
              {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditJobInterview;