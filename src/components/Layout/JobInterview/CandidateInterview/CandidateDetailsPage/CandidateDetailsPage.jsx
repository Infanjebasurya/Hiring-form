// src/components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/CandidateDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Alert,
  Skeleton,
  Snackbar,
  Chip,
  Divider,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Download as DownloadIcon,
  ArrowForwardIos as ArrowForwardIosIcon 
} from '@mui/icons-material';
import CandidateProfile from './components/CandidateProfile/CandidateProfile';
import InternalQuestions from './components/InternalQuestions/InternalQuestions';
import InterviewRounds from './components/InterviewRounds/InterviewRounds';
import { getCandidateById, downloadResume, downloadCoverLetter } from './CandidateService';

const CandidateDetailsPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRound, setExpandedRound] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!candidateId) {
      setError('No candidate ID provided');
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const data = await getCandidateById(candidateId);
        const transformedData = transformCandidateData(data);
        setCandidate(transformedData);
      } catch (err) {
        setError(`Failed to load candidate: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  const transformCandidateData = (apiData) => {
    return {
      id: apiData.id,
      candidateId: apiData.candidate_id || apiData.id,
      jobId: apiData.job_id,
      name: apiData.name,
      email: apiData.email,
      phone: apiData.phone,
      position: apiData.applied_role || apiData.position,
      status: apiData.status || 'In Progress',
      experience: apiData.experience || 'Not specified',
      location: apiData.location || 'Not specified',
      source: apiData.source || 'Not specified',
      availability: apiData.availability || 'Not specified',
      skills: apiData.skills || [],
      
      resumeLink: apiData.resume_url || apiData.attachments?.resume,
      coverLetterLink: apiData.cover_letter_url || apiData.attachments?.cover_letter,
      attachments: apiData.attachments ? [
        {
          name: 'Resume',
          type: 'Resume',
          size: apiData.resume_size || '2.4 MB',
          uploadedDate: apiData.resume_upload_date || '2023-10-15'
        },
        {
          name: 'Cover Letter',
          type: 'Cover Letter',
          size: apiData.cover_letter_size || '1.2 MB',
          uploadedDate: apiData.cover_letter_upload_date || '2023-10-15'
        }
      ] : [],
      
      internalQuestions: apiData.internal_questions?.map((q, index) => ({
        id: q.id || `iq-${index}`,
        question: q.question,
        answer: q.answer,
        interviewerNotes: q.interviewer_notes || q.notes,
        rating: q.rating,
        maxRating: 5
      })) || [],
      
      interviewRounds: apiData.interview_rounds?.map((round, index) => ({
        roundNumber: round.round_number || index + 1,
        roundName: round.round_name || round.name,
        date: round.date || round.scheduled_date,
        duration: round.duration || '60 mins',
        interviewer: round.interviewer_name || round.interviewer,
        status: round.status,
        rating: round.rating,
        notes: round.interviewer_notes || round.notes,
        feedback: round.feedback || round.feedback_summary,
        questions: round.questions?.map((q, qIndex) => ({
          id: q.id || `q-${index}-${qIndex}`,
          type: q.type || 'theory',
          question: q.question,
          answer: q.answer || q.candidate_response,
          options: q.options,
          language: q.language,
          rating: q.rating
        })) || []
      })) || [],
      
      roundsCompleted: apiData.interview_rounds?.filter(r => r.status === 'Completed').length || 0,
      totalRounds: apiData.interview_rounds?.length || 0
    };
  };

  // Handle PDF resume download
  const handleDownloadResume = async () => {
    try {
      // Create PDF blob for demo
      const resumeContent = `
        Resume - Alice Johnson
        ======================
        
        Contact Information:
        --------------------
        Email: alicejohnson@example.com
        Phone: +1 (555) 123-4567
        Location: San Francisco, CA
        
        Position: Senior Software Engineer
        
        Summary:
        --------
        Experienced Senior Software Engineer with 8 years of expertise in 
        JavaScript, React, Node.js, Python, and AWS. Passionate about 
        building scalable applications and leading development teams.
        
        Experience:
        -----------
        • Senior Software Engineer at TechCorp (2019-Present)
        • Software Engineer at StartupX (2016-2019)
        • Junior Developer at WebDev Inc (2014-2016)
        
        Skills:
        -------
        • JavaScript/TypeScript • React.js • Node.js
        • Python • AWS • MongoDB • Docker • Git
        
        Education:
        ----------
        • MSc Computer Science, Stanford University
        • BSc Software Engineering, MIT
      `;
      
      // Create a PDF blob using jsPDF or similar library
      // For now, we'll create a text file that can be saved as PDF
      const blob = new Blob([resumeContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_Alice_Johnson_${candidateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: 'Resume downloaded as PDF',
        severity: 'success'
      });
      
      // If you have actual API:
      // await downloadResume(candidateId);
      // setSnackbar({
      //   open: true,
      //   message: 'Resume downloaded successfully',
      //   severity: 'success'
      // });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to download resume',
        severity: 'error'
      });
    }
  };

  const handleDownloadCoverLetter = async () => {
    try {
      const coverLetterContent = `
        Cover Letter - Alice Johnson
        ============================
        
        Dear Hiring Manager,
        
        I am writing to express my interest in the Senior Software Engineer 
        position. With 8 years of experience in software development...
      `;
      
      const blob = new Blob([coverLetterContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cover_Letter_Alice_Johnson_${candidateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: 'Cover letter downloaded as PDF',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to download cover letter',
        severity: 'error'
      });
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setSnackbar({
      open: true,
      message: 'Email copied to clipboard',
      severity: 'success'
    });
  };

  const handleBack = () => navigate('/candidate-interviews');

  const handleEditCandidate = () => {
    navigate(`/candidate-interviews/edit/${candidateId}`);
  };

  const handleScheduleRound = () => {
    navigate(`/candidate-interviews/schedule/${candidateId}`);
  };

  const handleSubmitFeedback = async (round) => {
    try {
      console.log('Submit feedback for round:', round);
      setSnackbar({
        open: true,
        message: `Feedback submitted for ${round.roundName}`,
        severity: 'success'
      });
      
      // Refresh data
      const data = await getCandidateById(candidateId);
      setCandidate(transformCandidateData(data));
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to submit feedback',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Interviews
        </Button>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !candidate) {
    return (
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Interviews
        </Button>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Candidate not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/candidate-interviews')}>
          Return to Candidate List
        </Button>
      </Box>
    );
  }

  // Calculate progress percentage
  const progressPercentage = candidate.totalRounds > 0 
    ? (candidate.roundsCompleted / candidate.totalRounds) * 100 
    : 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ 
            mb: 2,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          Back to Interviews
        </Button>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3 
        }}>
          <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Candidate Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive view of candidate information and interview progress
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadResume}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Download Resume (PDF)
          </Button>
        </Box>
      </Box>

      {/* Progress Bar - Fixed with proper styling */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" fontWeight="600" color="text.primary">
            Interview Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidate.roundsCompleted} of {candidate.totalRounds} rounds completed
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: 'action.disabledBackground',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: 'primary.main',
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)',
                backgroundSize: '1rem 1rem',
                animation: 'progress-animation 1s linear infinite',
              },
              '@keyframes progress-animation': {
                '0%': {
                  backgroundPosition: '1rem 0',
                },
                '100%': {
                  backgroundPosition: '0 0',
                },
              },
            }}
          />
          
          {/* Progress milestones */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            position: 'relative',
            mt: 1.5 
          }}>
            {candidate.interviewRounds?.map((round, index) => (
              <Box key={index} sx={{ textAlign: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: round.status === 'Completed' ? 'success.main' : 
                             round.status === 'Pending Feedback' ? 'warning.main' :
                             round.status === 'Scheduled' ? 'info.main' : 'grey.300',
                    border: '3px solid white',
                    position: 'absolute',
                    top: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    boxShadow: 2,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                  Round {round.roundNumber}
                </Typography>
                <Typography variant="caption" color="text.primary" fontWeight="500" sx={{ display: 'block' }}>
                  {round.status}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Progress stats */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Rounds
            </Typography>
            <Typography variant="h6" fontWeight="700">{candidate.totalRounds}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Completed
            </Typography>
            <Typography variant="h6" fontWeight="700" color="success.main">
              {candidate.roundsCompleted}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Pending
            </Typography>
            <Typography variant="h6" fontWeight="700" color="warning.main">
              {candidate.totalRounds - candidate.roundsCompleted}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Progress
            </Typography>
            <Typography variant="h6" fontWeight="700">
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Candidate Profile */}
        <Grid item xs={12} md={4}>
          <CandidateProfile 
            candidate={candidate}
            onEdit={handleEditCandidate}
            onScheduleRound={handleScheduleRound}
            onDownloadResume={handleDownloadResume}
            onDownloadCoverLetter={handleDownloadCoverLetter}
            onCopyEmail={handleCopyEmail}
          />
        </Grid>

        {/* Right Column - Interview Details */}
        <Grid item xs={12} md={8}>
          {/* Internal Questions */}
          {candidate.internalQuestions && candidate.internalQuestions.length > 0 && (
            <InternalQuestions questions={candidate.internalQuestions} />
          )}
          
          {/* Interview Rounds */}
          <Box sx={{ mt: 3 }}>
            <InterviewRounds 
              rounds={candidate.interviewRounds}
              expandedRound={expandedRound}
              onExpandRound={setExpandedRound}
              onSubmitFeedback={handleSubmitFeedback}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidateDetailsPage;