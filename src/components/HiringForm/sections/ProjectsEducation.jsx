import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  Button
} from '@mui/material';
import {
  Delete,
  Add,
  School,
  Description
} from '@mui/icons-material';
import { Fade, Zoom } from '@mui/material';
import { InfoAlert, SectionHeader } from '../components/FormComponents';

const ProjectsEducation = ({
  formData,
  errors,
  handleNestedArrayChange,
  addArrayItem,
  removeArrayItem,
  darkMode = false,
  isSmallMobile = false
}) => {
  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <InfoAlert
          icon={<School />}
          title="Projects & Education"
          darkMode={darkMode}
          severity="success"
        >
          Showcase your projects and educational background to demonstrate your practical experience and qualifications.
        </InfoAlert>

        {/* Projects Section */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            icon={<Description />}
            title="Projects & Portfolio"
            actionButton={
              <Button
                startIcon={<Add />}
                onClick={() => addArrayItem('projects', {
                  projectName: '',
                  description: '',
                  role: '',
                  technologies: '',
                  achievements: '',
                  projectLink: ''
                })}
                variant="outlined"
                color="primary"
                size={isSmallMobile ? "small" : "medium"}
              >
                Add Project
              </Button>
            }
          />

          {formData.projects.map((project, index) => (
            <Zoom in={true} timeout={500} key={index}>
              <Paper sx={{
                p: { xs: 2, md: 2.5 },
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                background: darkMode ? 'rgba(15, 23, 42, 0.64)' : '#ffffff',
                boxShadow: darkMode ? '0 10px 28px rgba(0,0,0,0.20)' : '0 10px 28px rgba(15,23,42,0.05)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="subtitle1" color="secondary" fontWeight={800}>
                    Project #{index + 1}
                  </Typography>
                  {formData.projects.length > 1 && (
                    <Tooltip title="Remove this project">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeArrayItem('projects', index)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={project.projectName}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'projectName', e.target.value)}
                      error={!!errors[`projects_${index}_projectName`]}
                      helperText={errors[`projects_${index}_projectName`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., E-commerce Platform, Mobile App, Data Analysis Tool"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Project Description"
                      value={project.description}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'description', e.target.value)}
                      error={!!errors[`projects_${index}_description`]}
                      helperText={errors[`projects_${index}_description`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="Describe the project, its purpose, target audience, and key features..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Role & Responsibilities"
                      value={project.role}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'role', e.target.value)}
                      error={!!errors[`projects_${index}_role`]}
                      helperText={errors[`projects_${index}_role`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Frontend Developer, Project Lead, Full-stack Developer"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Technologies & Tools Used"
                      value={project.technologies}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'technologies', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Achievements & Impact"
                      value={project.achievements}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'achievements', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="Describe the impact, results, and key achievements of this project..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Link (URL)"
                      value={project.projectLink}
                      onChange={(e) => handleNestedArrayChange('projects', index, 'projectLink', e.target.value)}
                      error={!!errors[`projects_${index}_projectLink`]}
                      helperText={errors[`projects_${index}_projectLink`] || "Optional - Must be a valid URL if provided"}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="https://github.com/yourusername/project or https://yourproject.com"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          ))}

          {formData.projects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" fontStyle="italic">
                No projects added yet. Showcase your work by adding projects above!
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Education Section */}
        <Box>
          <SectionHeader
            icon={<School />}
            title="Education Background"
            actionButton={
              <Button
                startIcon={<Add />}
                onClick={() => addArrayItem('education', {
                  degree: '',
                  institution: '',
                  university: '',
                  startYear: '',
                  endYear: '',
                  location: '',
                  currentlyStudying: false
                })}
                variant="outlined"
                color="primary"
                size={isSmallMobile ? "small" : "medium"}
              >
                Add Education
              </Button>
            }
          />

          {formData.education.map((edu, index) => (
            <Zoom in={true} timeout={500} key={index}>
              <Paper sx={{
                p: { xs: 2, md: 2.5 },
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                background: darkMode ? 'rgba(15, 23, 42, 0.64)' : '#ffffff',
                boxShadow: darkMode ? '0 10px 28px rgba(0,0,0,0.20)' : '0 10px 28px rgba(15,23,42,0.05)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="subtitle1" color="info.main" fontWeight={800}>
                    Education #{index + 1}
                  </Typography>
                  {formData.education.length > 1 && (
                    <Tooltip title="Remove this education">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeArrayItem('education', index)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Degree / Qualification"
                      value={edu.degree}
                      onChange={(e) => handleNestedArrayChange('education', index, 'degree', e.target.value)}
                      error={!!errors[`education_${index}_degree`]}
                      helperText={errors[`education_${index}_degree`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Institution Name"
                      value={edu.institution}
                      onChange={(e) => handleNestedArrayChange('education', index, 'institution', e.target.value)}
                      error={!!errors[`education_${index}_institution`]}
                      helperText={errors[`education_${index}_institution`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Massachusetts Institute of Technology"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="University / Department"
                      value={edu.university}
                      onChange={(e) => handleNestedArrayChange('education', index, 'university', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., School of Computer Science"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={edu.location}
                      onChange={(e) => handleNestedArrayChange('education', index, 'location', e.target.value)}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="e.g., Cambridge, Massachusetts"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Year"
                      type="number"
                      value={edu.startYear}
                      onChange={(e) => handleNestedArrayChange('education', index, 'startYear', e.target.value)}
                      error={!!errors[`education_${index}_startYear`]}
                      helperText={errors[`education_${index}_startYear`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="YYYY"
                      inputProps={{ min: "1900", max: "2030" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Year"
                      type="number"
                      value={edu.endYear}
                      onChange={(e) => handleNestedArrayChange('education', index, 'endYear', e.target.value)}
                      error={!!errors[`education_${index}_endYear`]}
                      helperText={errors[`education_${index}_endYear`]}
                      variant="outlined"
                      size={isSmallMobile ? "small" : "medium"}
                      placeholder="YYYY"
                      disabled={edu.currentlyStudying}
                      inputProps={{ min: "1900", max: "2030" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={edu.currentlyStudying}
                          onChange={(e) => handleNestedArrayChange('education', index, 'currentlyStudying', e.target.checked)}
                          color="primary"
                          size={isSmallMobile ? "small" : "medium"}
                        />
                      }
                      label="Currently Studying"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>
          ))}

          {formData.education.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" fontStyle="italic">
                No education details added yet. Add your educational background above!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectsEducation;
