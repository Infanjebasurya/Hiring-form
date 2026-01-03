// src/components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/components/InternalQuestions/InternalQuestions.jsx

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Badge,
  Rating,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Notes as NotesIcon,
  EditNote as EditNoteIcon,
} from '@mui/icons-material';

const InternalQuestions = ({ questions = [] }) => {
  const [expanded, setExpanded] = useState(true);

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Accordion 
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          boxShadow: 'none',
          '&:before': { display: 'none' },
          bgcolor: 'transparent'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            bgcolor: 'transparent',
            p: 0,
            minHeight: 'auto',
            '& .MuiAccordionSummary-content': { my: 1 }
          }}
        >
          <Typography variant="h6" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuestionAnswerIcon />
            Internal Questions
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {questions.map((question, index) => (
              <Card key={question.id || index} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Question {index + 1}: {question.question}
                    </Typography>
                    <Badge badgeContent={`${question.rating}/${question.maxRating || 5}`} color="primary">
                      <Rating 
                        value={question.rating} 
                        max={question.maxRating || 5} 
                        readOnly 
                        size="small" 
                      />
                    </Badge>
                  </Box>
                  
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="500" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotesIcon fontSize="small" />
                    Answer (Candidate):
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {question.answer || 'No answer provided'}
                    </Typography>
                  </Paper>
                  
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="500" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditNoteIcon fontSize="small" />
                    Interviewer Notes:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {question.interviewerNotes || 'No notes provided'}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default InternalQuestions;