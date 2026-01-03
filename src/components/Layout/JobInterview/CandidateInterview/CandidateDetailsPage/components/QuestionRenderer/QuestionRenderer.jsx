import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Chip,
  Rating as MuiRating,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  FormatListBulleted as FormatListBulletedIcon,
  TextFields as TextFieldsIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

const QuestionRenderer = ({ questions = [], roundStatus }) => {
  const getQuestionIcon = (type) => {
    const icons = {
      'theory': <PsychologyIcon color="primary" fontSize="small" />,
      'programming': <CodeIcon color="primary" fontSize="small" />,
      'multiple': <FormatListBulletedIcon color="primary" fontSize="small" />,
      'single': <FormatListBulletedIcon color="primary" fontSize="small" />,
      'fill': <TextFieldsIcon color="primary" fontSize="small" />,
      'matching': <ConnectWithoutContactIcon color="primary" fontSize="small" />,
      'practical': <AutoAwesomeIcon color="primary" fontSize="small" />,
    };
    return icons[type] || <FormatListBulletedIcon color="primary" fontSize="small" />;
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'theory': 'Theory Question',
      'programming': 'Programming Question',
      'multiple': 'Multiple Choice (Multiple Answers)',
      'single': 'Multiple Choice (Single Answer)',
      'fill': 'Fill in the Blank',
      'matching': 'Matching Type',
      'practical': 'Practical/Scenario-based',
    };
    return labels[type] || type;
  };

  const renderQuestionContent = (question) => {
    switch (question.type) {
      case 'theory':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Theory Answer
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || 'No answer provided yet'}
              </Typography>
            </Paper>
            {question.rating !== null && question.rating !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" sx={{ mr: 1, fontWeight: 500 }}>Rating:</Typography>
                <MuiRating value={question.rating} max={question.maxRating || 5} readOnly size="small" />
              </Box>
            )}
          </Box>
        );

      case 'single':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Single Choice Answer
            </Typography>
            <RadioGroup value={question.answer || ''}>
              {question.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled
                />
              ))}
            </RadioGroup>
          </Box>
        );

      case 'multiple':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Multiple Choice Answer
            </Typography>
            <FormGroup>
              {question.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={question.answer?.includes(option) || false}
                      disabled
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </Box>
        );

      case 'programming':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Programming Solution ({question.language})
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'rgb(30, 30, 30)', borderRadius: 1, fontFamily: 'monospace', overflow: 'auto' }}>
              <Typography variant="body2" color="common.white" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || '// No solution provided yet'}
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return (
          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2">{question.answer || 'No answer provided'}</Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {questions.map((question, index) => (
        <Card key={question.id || index} variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {getQuestionIcon(question.type)}
              <Typography variant="subtitle2" fontWeight="600">
                Question {index + 1} - {getQuestionTypeLabel(question.type)}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}>
              {question.question}
            </Typography>
            
            {renderQuestionContent(question)}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default QuestionRenderer;