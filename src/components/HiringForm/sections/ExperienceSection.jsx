import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button
} from '@mui/material';
import {
  Delete,
  Add,
  Work,
  Code,
  Psychology,
  Build,
  Group
} from '@mui/icons-material';
import { Zoom } from '@mui/material';
import { FormTextField, SectionHeader, InfoAlert } from '../components/FormComponents';

const ExperienceSection = ({
  formData,
  errors,
  handleNestedArrayChange,
  handleInputChange,
  addArrayItem,
  removeArrayItem,
  darkMode = false,
  isMobile = false,
  isSmallMobile = false
}) => {
  const skillCategories = [
    { value: 'technical', label: 'Technical Skills', icon: <Code /> },
    { value: 'soft', label: 'Soft Skills', icon: <Psychology /> },
    { value: 'tools', label: 'Tools & Technologies', icon: <Build /> },
    { value: 'frameworks', label: 'Frameworks & Platforms', icon: <Group /> }
  ];

  // Add skill to specific experience
  const handleAddSkillToExperience = (expIndex) => {
    const { newSkill, skillExperience, skillCategory } = formData;
    if (newSkill && newSkill.trim() && skillExperience && skillCategory) {
      const newSkillObj = {
        name: newSkill.trim(),
        experience: skillExperience,
        category: skillCategory
      };

      const currentExperience = formData.experiences[expIndex];
      const updatedSkills = [...(currentExperience.skills || []), newSkillObj];

      handleNestedArrayChange('experiences', expIndex, 'skills', updatedSkills);

      // Clear the skill input fields using handleInputChange
      handleInputChange('newSkill', '');
      handleInputChange('skillExperience', '');
      handleInputChange('skillCategory', '');
    }
  };

  // Remove skill from specific experience
  const handleRemoveSkillFromExperience = (expIndex, skillIndex) => {
    const currentExperience = formData.experiences[expIndex];
    const updatedSkills = currentExperience.skills.filter((_, i) => i !== skillIndex);
    handleNestedArrayChange('experiences', expIndex, 'skills', updatedSkills);
  };

  // Handle nested array changes properly
  const handleExperienceChange = (index, field, value) => {
    handleNestedArrayChange('experiences', index, field, value);
  };

  // Render skills section for each experience
  const renderSkillsSection = (exp, expIndex) => (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
        <Code />
        Skills Used in This Role
      </Typography>

      {/* Add Skills Form */}
      <Paper sx={{
        p: 2,
        mb: 2,
        border: '1px solid',
        borderColor: 'secondary.light',
        background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
      }}>
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
              <InputLabel>Skill Category</InputLabel>
              <Select
                value={formData.skillCategory || ''}
                label="Skill Category"
                onChange={(e) => handleInputChange('skillCategory', e.target.value)}
              >
                {skillCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.icon}
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormTextField
              label="Skill Name"
              value={formData.newSkill || ''}
              onChange={(e) => handleInputChange('newSkill', e.target.value)}
              placeholder="e.g., React, Python, Leadership"
              size={isSmallMobile ? "small" : "medium"}
              darkMode={darkMode}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormTextField
              label="Experience Level"
              value={formData.skillExperience || ''}
              onChange={(e) => handleInputChange('skillExperience', e.target.value)}
              placeholder="e.g., 3 years, Advanced"
              size={isSmallMobile ? "small" : "medium"}
              darkMode={darkMode}
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <Tooltip title="Add Skill to This Role">
              <IconButton
                onClick={() => handleAddSkillToExperience(expIndex)}
                disabled={!formData.newSkill?.trim() || !formData.skillExperience || !formData.skillCategory}
                color="primary"
                sx={{ height: '56px', width: '100%' }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Skills List for this Experience */}
      {exp.skills && exp.skills.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            {exp.skills.map((skill, skillIndex) => (
              <Grid item key={skillIndex}>
                <Chip
                  label={`${skill.name} (${skill.experience})`}
                  onDelete={() => handleRemoveSkillFromExperience(expIndex, skillIndex)}
                  color="secondary"
                  variant="outlined"
                  deleteIcon={<Delete />}
                  size={isSmallMobile ? "small" : "medium"}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: darkMode ? 'rgba(244, 143, 177, 0.1)' : 'transparent',
                    border: darkMode ? '1px solid rgba(244, 143, 177, 0.3)' : '1px solid rgba(0, 0, 0, 0.2)',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <InfoAlert
        icon={<Work />}
        title="Work Experience & Skills"
        darkMode={darkMode}
      >
        Add your work experience in reverse chronological order. For each role, include the skills you used and your proficiency level.
        Skills are now integrated with each work experience for better context.
      </InfoAlert>

      <SectionHeader
        icon={<Work />}
        title="Professional Experience & Skills"
        actionButton={
          <Button
            startIcon={<Add />}
            onClick={() => addArrayItem('experiences', {
              jobTitle: '',
              company: '',
              startDate: '',
              endDate: '',
              location: '',
              responsibilities: '',
              achievements: '',
              technologies: '',
              currentlyWorking: false,
              skills: []
            })}
            variant="outlined"
            color="primary"
            size={isSmallMobile ? "small" : "medium"}
          >
            Add Experience
          </Button>
        }
        subtitle="Add your work history and the skills you utilized in each role"
      />

      {formData.experiences.map((exp, index) => (
        <Zoom in={true} timeout={500} key={index}>
          <Paper sx={{
            p: 3,
            mb: 3,
            border: '2px solid',
            borderColor: 'primary.light',
            background: darkMode
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Experience Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                🏢 Experience #{index + 1}
              </Typography>
              {formData.experiences.length > 1 && (
                <Tooltip title="Remove this experience">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeArrayItem('experiences', index)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <FormTextField
                  required
                  label="Job Title"
                  value={exp.jobTitle || ''}
                  onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                  error={!!errors[`experience_${index}_jobTitle`]}
                  helperText={errors[`experience_${index}_jobTitle`]}
                  placeholder="e.g., Senior Software Engineer"
                  size={isSmallMobile ? "small" : "medium"}
                  darkMode={darkMode}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormTextField
                  required
                  label="Company Name"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  error={!!errors[`experience_${index}_company`]}
                  helperText={errors[`experience_${index}_company`]}
                  placeholder="e.g., Google Inc."
                  size={isSmallMobile ? "small" : "medium"}
                  darkMode={darkMode}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormTextField
                  required
                  label="Start Date"
                  type="date"
                  value={exp.startDate || ''}
                  onChange={(e) =>
                    handleExperienceChange(index, 'startDate', e.target.value)
                  }
                  error={!!errors[`experience_${index}_startDate`]}
                  helperText={errors[`experience_${index}_startDate`]}
                  size={isSmallMobile ? 'small' : 'medium'}
                  darkMode={darkMode}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: darkMode ? 'invert(1)' : 'invert(0.5)',
                      cursor: 'pointer',
                      opacity: 1,
                    },
                    '& input[type="date"]': {
                      colorScheme: darkMode ? 'dark' : 'light',
                    },
                    '& .MuiOutlinedInput-root': {
                      color: darkMode ? '#fff' : '#000',
                      '& fieldset': {
                        borderColor: darkMode ? '#555' : '#ccc',
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? '#81c784' : '#1976d2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#ccc' : '#444',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormTextField
                  label="End Date"
                  type="date"
                  value={exp.endDate || ''}
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                  size={isSmallMobile ? 'small' : 'medium'}
                  darkMode={darkMode}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: exp.currentlyWorking ? (
                      <InputAdornment position="end">
                        <Chip label="Present" size="small" color="success" />
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: darkMode ? 'invert(1)' : 'brightness(0) invert(0.4)',
                      cursor: 'pointer',
                      opacity: 1,
                    },
                    '& input[type="date"]': {
                      colorScheme: darkMode ? 'dark' : 'light',
                    },
                    '& .MuiOutlinedInput-root': {
                      color: darkMode ? '#fff' : '#000',
                      '& fieldset': {
                        borderColor: darkMode ? '#555' : '#ccc',
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? '#81c784' : '#1976d2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: darkMode ? '#ccc' : '#444',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormTextField
                  label="Location"
                  value={exp.location || ''}
                  onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                  placeholder="e.g., San Francisco, CA (Remote)"
                  size={isSmallMobile ? "small" : "medium"}
                  darkMode={darkMode}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: isSmallMobile ? 1 : 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.currentlyWorking || false}
                        onChange={(e) => {
                          handleExperienceChange(index, 'currentlyWorking', e.target.checked);
                          if (e.target.checked) {
                            handleExperienceChange(index, 'endDate', '');
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="I currently work here"
                  />
                </Box>
              </Grid>

              {/* Skills Section for this Experience */}
              <Grid item xs={12}>
                {renderSkillsSection(exp, index)}
              </Grid>

              {/* Responsibilities, Achievements & Technologies - ALL IN ONE ROW */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    label="Responsibilities & Duties"
                    value={exp.responsibilities || ''}
                    onChange={(e) => handleExperienceChange(index, 'responsibilities', e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Describe your main responsibilities and daily tasks..."
                    size={isSmallMobile ? "small" : "medium"}
                    darkMode={darkMode}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormTextField
                    label="Key Achievements & Contributions"
                    value={exp.achievements || ''}
                    onChange={(e) => handleExperienceChange(index, 'achievements', e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Highlight your key achievements, projects, and impact..."
                    size={isSmallMobile ? "small" : "medium"}
                    darkMode={darkMode}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormTextField
                    label="Technologies & Tools Used"
                    value={exp.technologies || ''}
                    onChange={(e) => handleExperienceChange(index, 'technologies', e.target.value)}
                    multiline
                    rows={4}
                    placeholder="e.g., React, Node.js, AWS, Python, MongoDB, Docker, Kubernetes..."
                    size={isSmallMobile ? "small" : "medium"}
                    darkMode={darkMode}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
      ))}

      {formData.experiences.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Work sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary" fontStyle="italic">
            No work experience added yet. Click "Add Experience" to get started!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ExperienceSection;