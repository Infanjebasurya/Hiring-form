// src/components/CreateNewProcess/CreateNewProcess.jsx
import React, { useState, useEffect } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Use Vite's environment variable (fallback to localhost)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CreateNewProcess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  
  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [interviewersList, setInterviewersList] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    id: editData?.id || Date.now(),
    jobId: editData?.jobId || 'SW567',
    jdLink: editData?.jdLink || '',
    interviewRounds: editData?.interviewRounds || [
      {
        id: Date.now(),
        name: '',
        interviewer: '',
        isSelfAssigned: false,
      }
    ],
  });
  
  const [newRoundName, setNewRoundName] = useState('');

  // Fetch interviewers on component mount
  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setInterviewersList([
        'John Doe (john@company.com)',
        'Jane Smith (jane@company.com)',
        'Bob Johnson (bob@company.com)',
        'Alice Brown (alice@company.com)',
        'Rajesh R (rajesh@company.com)',
        'Sarah Williams (sarah@company.com)',
        'Mike Chen (mike@company.com)',
      ]);
    } catch (err) {
      console.error('Error fetching interviewers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/job-interviews');
  };

  const handleNavigateToCandidateManagement = () => {
    navigate('/candidate-interviews');
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

  const handleDeleteRound = (id) => {
    if (formData.interviewRounds.length <= 1) {
      setError('At least one interview round is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter(round => round.id !== id)
    }));
  };

  const handleRoundNameChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { ...round, name: value } : round
      )
    }));
  };

  const handleInterviewerChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { 
          ...round, 
          interviewer: value,
          isSelfAssigned: value === 'Rajesh R (rajesh@company.com)' 
        } : round
      )
    }));
  };

  const handleSelfAssign = (id) => {
    const selfInterviewer = 'Rajesh R (rajesh@company.com)';
    
    setFormData(prev => ({
      ...prev,
      interviewRounds: prev.interviewRounds.map(round => 
        round.id === id ? { 
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

      // Prepare API payload
      const payload = {
        ...formData,
        rounds: formData.interviewRounds.length,
        status: 'In progress',
        candidates: 0,
        team: ['JD', 'MJ', 'AR'],
        createdAt: editData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Saving payload:', payload);

      // Save to localStorage
      const existingProcesses = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
      
      if (editData) {
        // Update existing process
        const updatedProcesses = existingProcesses.map(process => 
          process.id === formData.id ? payload : process
        );
        localStorage.setItem('jobInterviews', JSON.stringify(updatedProcesses));
      } else {
        // Add new process
        localStorage.setItem('jobInterviews', JSON.stringify([...existingProcesses, payload]));
      }

      console.log('Process saved successfully:', payload);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/job-interviews');
      }, 2000);

    } catch (err) {
      console.error('Error saving process:', err);
      setError(err.message || 'Failed to save interview process. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: '1200px',
      margin: '0 auto', 
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: { xs: 3, sm: 4 },
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleBack}
            disabled={saving}
            sx={{ 
              p: { xs: 1, sm: 1.5 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            {editData ? 'Edit Interview Process' : 'Create Interview Process'}
          </Typography>
        </Box>

        {/* Candidate Management Button */}
        <Tooltip title="Go to Candidate Management">
          <Button
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={handleNavigateToCandidateManagement}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark',
                bgcolor: 'action.hover',
              },
              '&:disabled': {
                borderColor: 'divider',
                color: 'action.disabled',
                bgcolor: 'action.disabledBackground',
              },
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            Manage Candidates
          </Button>
        </Tooltip>
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
          Interview process {editData ? 'updated' : 'created'} successfully! Redirecting...
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
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary'
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
                bgcolor: 'background.paper',
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
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary'
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
                  color: 'text.secondary',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'background.paper',
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
          borderColor: 'divider',
        }} />

        {/* Interview Rounds Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: 'text.primary'
            }}
          >
            Interview Rounds
          </Typography>

          {/* Existing Rounds */}
          {formData.interviewRounds.map((round, index) => (
            <Paper
              key={round.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Round Header - Always editable */}
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
                    minWidth: '60px',
                    color: 'text.primary'
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
                      bgcolor: 'action.hover',
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
                      color: 'text.secondary',
                      p: { xs: 0.5, sm: 1 },
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: 'action.hover'
                      }
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
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: 'text.primary'
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
                      bgcolor: 'action.hover',
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
                      borderColor: 'text.secondary',
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      '&:hover': {
                        borderColor: 'text.primary',
                        color: 'text.primary',
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
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2 },
                      flex: isMobile ? 1 : 'auto',
                      ...(round.isSelfAssigned
                        ? {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            }
                          }
                        : {
                            borderColor: 'text.secondary',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: 'text.primary',
                              color: 'text.primary',
                            }
                          })
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
                      color: 'text.secondary',
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
                      bgcolor: round.isSelfAssigned 
                        ? theme.palette.mode === 'light' 
                          ? '#e3f2fd' 
                          : 'rgba(30, 136, 229, 0.16)'
                        : theme.palette.mode === 'light'
                          ? '#f0f0f0'
                          : 'rgba(255, 255, 255, 0.08)',
                      color: round.isSelfAssigned 
                        ? theme.palette.mode === 'light' 
                          ? '#1976d2' 
                          : '#90caf9'
                        : theme.palette.mode === 'light'
                          ? '#333'
                          : 'text.primary',
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
                  bgcolor: 'background.paper',
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
                borderColor: 'text.secondary',
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                }
              }}
            >
              Add Interview Round
            </Button>
          </Box>
        </Box>

        {/* Save Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', sm: 'flex-end' }, 
          mt: { xs: 3, sm: 4 },
          width: '100%'
        }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || success}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.25 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              '&:disabled': {
                opacity: 0.7
              }
            }}
          >
            {saving ? 'Saving...' : success ? 'Saved!' : (editData ? 'Update Process' : 'Save Process')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNewProcess;