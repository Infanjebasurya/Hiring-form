import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Alert,
  Fade,
  Divider,
  useTheme
} from '@mui/material';
import {
  Person,
  Description,
  Work,
  School,
  Code,
  Psychology,
  Build,
  Group,
  Language,
  Interests,
  CheckCircle,
  Warning,
  AttachFile
} from '@mui/icons-material';

const ReviewSubmission = ({ formData, errors, handleInputChange, darkMode = false }) => {
  const theme = useTheme();

  const skillCategories = [
    { value: 'technical', label: 'Technical Skills', icon: <Code /> },
    { value: 'soft', label: 'Soft Skills', icon: <Psychology /> },
    { value: 'tools', label: 'Tools & Technologies', icon: <Build /> },
    { value: 'frameworks', label: 'Frameworks & Platforms', icon: <Group /> }
  ];

  // Card styling based on theme
  const getCardStyle = (borderColor) => ({
    height: '100%',
    boxShadow: 3,
    border: '2px solid',
    borderColor: borderColor,
    background: darkMode
      ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
    color: darkMode ? 'white' : 'inherit'
  });

  // Chip styling based on theme
  const getChipStyle = (color = 'primary') => ({
    mb: 1,
    backgroundColor: darkMode ? `${theme.palette[color].main}20` : 'transparent',
    borderColor: theme.palette[color].main,
    color: darkMode ? theme.palette[color].light : theme.palette[color].main,
    '&:hover': {
      backgroundColor: darkMode ? `${theme.palette[color].main}30` : `${theme.palette[color].main}10`,
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease',
  });

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            background: darkMode
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: '1px solid',
            borderColor: darkMode ? '#3949ab' : '#90caf9',
            color: darkMode ? 'white' : 'inherit'
          }}
          icon={<CheckCircle />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Review & Submit
          </Typography>
          Please review all your information carefully before submitting. Ensure everything is accurate and complete.
        </Alert>

        <Grid container spacing={3}>
          {/* Personal Information Review */}
          <Grid item xs={12} md={6}>
            <Card sx={getCardStyle('primary.light')}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 2, 
                  color: 'primary.main' 
                }}>
                  <Person />
                  Personal Information
                </Typography>
                <Box sx={{ space: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                    <strong>Position:</strong> {formData.jobTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                    <strong>Phone:</strong> {formData.contactNumber}
                  </Typography>
                  {formData.location && (
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                      <strong>Location:</strong> {formData.location}
                    </Typography>
                  )}
                  {formData.linkedin && (
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                      <strong>LinkedIn:</strong> {formData.linkedin}
                    </Typography>
                  )}
                  {formData.portfolio && (
                    <Typography variant="body2" sx={{ mb: 1, color: darkMode ? 'text.primary' : 'inherit' }}>
                      <strong>Portfolio:</strong> {formData.portfolio}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Summary Review */}
          <Grid item xs={12} md={6}>
            <Card sx={getCardStyle('secondary.light')}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  color: 'secondary.main' 
                }}>
                  Professional Summary
                </Typography>
                <Typography variant="body2" sx={{ 
                  lineHeight: 1.6, 
                  color: darkMode ? 'text.secondary' : 'text.secondary' 
                }}>
                  {formData.professionalSummary || 'Not provided'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Review */}
          {formData.skills.length > 0 && (
            <Grid item xs={12}>
              <Card sx={getCardStyle('info.light')}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: 'info.main' 
                  }}>
                    Skills & Expertise
                  </Typography>
                  {skillCategories.map((category) => {
                    const categorySkills = formData.skills.filter(skill => skill.category === category.value);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <Box key={category.value} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 1, 
                          color: 'primary.main' 
                        }}>
                          {category.icon}
                          {category.label}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {categorySkills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={`${skill.name} - ${skill.experience}`}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={getChipStyle('primary')}
                            />
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Work Experience Review */}
          {formData.experiences.length > 0 && formData.experiences.some(exp => exp.jobTitle || exp.company) && (
            <Grid item xs={12}>
              <Card sx={getCardStyle('warning.light')}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2, 
                    color: 'warning.main' 
                  }}>
                    <Work />
                    Work Experience
                  </Typography>
                  {formData.experiences.map((exp, index) => (
                    <Box key={index} sx={{ 
                      mb: 3, 
                      pb: 2, 
                      borderBottom: index < formData.experiences.length - 1 ? 1 : 0, 
                      borderColor: 'divider' 
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main' 
                      }}>
                        {exp.jobTitle || 'Untitled Position'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? 'text.secondary' : 'text.secondary', 
                        mb: 1 
                      }}>
                        {exp.company} {exp.startDate && `| ${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}`} {exp.location && `| ${exp.location}`}
                      </Typography>
                      
                      {exp.responsibilities && (
                        <Typography variant="body2" sx={{ 
                          mt: 1, 
                          lineHeight: 1.6,
                          color: darkMode ? 'text.primary' : 'inherit'
                        }}>
                          <strong>Responsibilities:</strong> {exp.responsibilities}
                        </Typography>
                      )}
                      
                      {exp.achievements && (
                        <Typography variant="body2" sx={{ 
                          mt: 1, 
                          lineHeight: 1.6,
                          color: darkMode ? 'text.primary' : 'inherit'
                        }}>
                          <strong>Achievements:</strong> {exp.achievements}
                        </Typography>
                      )}
                      
                      {exp.technologies && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 'bold',
                            color: darkMode ? 'text.primary' : 'inherit'
                          }}>
                            Technologies:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {exp.technologies.split(',').map((tech, techIndex) => (
                              <Chip 
                                key={techIndex} 
                                label={tech.trim()} 
                                size="small" 
                                variant="outlined" 
                                sx={getChipStyle('info')}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Projects Review */}
          {formData.projects.length > 0 && formData.projects.some(proj => proj.projectName) && (
            <Grid item xs={12} md={6}>
              <Card sx={getCardStyle('success.light')}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: 'success.main' 
                  }}>
                    Projects & Portfolio
                  </Typography>
                  {formData.projects.map((project, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      pb: 2, 
                      borderBottom: index < formData.projects.length - 1 ? 1 : 0, 
                      borderColor: 'divider' 
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main' 
                      }}>
                        {project.projectName}
                      </Typography>
                      {project.role && (
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? 'text.secondary' : 'text.secondary', 
                          display: 'block' 
                        }}>
                          Role: {project.role}
                        </Typography>
                      )}
                      {project.description && (
                        <Typography variant="body2" sx={{ 
                          mt: 0.5, 
                          lineHeight: 1.4,
                          color: darkMode ? 'text.primary' : 'inherit'
                        }}>
                          {project.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Education Review */}
          {formData.education.length > 0 && formData.education.some(edu => edu.degree) && (
            <Grid item xs={12} md={6}>
              <Card sx={getCardStyle('info.light')}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 2, 
                    color: 'info.main' 
                  }}>
                    <School />
                    Education
                  </Typography>
                  {formData.education.map((edu, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      pb: 2, 
                      borderBottom: index < formData.education.length - 1 ? 1 : 0, 
                      borderColor: 'divider' 
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main' 
                      }}>
                        {edu.degree}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? 'text.secondary' : 'text.secondary', 
                        display: 'block' 
                      }}>
                        {edu.institution} {edu.startYear && `| ${edu.startYear} - ${edu.currentlyStudying ? 'Present' : edu.endYear}`}
                      </Typography>
                      {edu.location && (
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? 'text.secondary' : 'text.secondary', 
                          display: 'block' 
                        }}>
                          Location: {edu.location}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Languages & Hobbies */}
          {(formData.languages.length > 0 || formData.hobbies.length > 0) && (
            <Grid item xs={12}>
              <Card sx={getCardStyle('secondary.light')}>
                <CardContent>
                  <Grid container spacing={3}>
                    {formData.languages.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2, 
                          color: 'primary.main' 
                        }}>
                          <Language />
                          Languages
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formData.languages.map((language, index) => (
                            <Chip
                              key={index}
                              label={`${language.name} (${language.proficiency})`}
                              color="secondary"
                              variant="outlined"
                              size="small"
                              sx={getChipStyle('secondary')}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    
                    {formData.hobbies.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2, 
                          color: 'primary.main' 
                        }}>
                          <Interests />
                          Hobbies & Interests
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formData.hobbies.map((hobby, index) => (
                            <Chip
                              key={index}
                              label={hobby}
                              variant="outlined"
                              size="small"
                              sx={getChipStyle('default')}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Documents Review */}
          <Grid item xs={12}>
            <Card sx={getCardStyle('success.light')}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  color: 'success.main' 
                }}>
                  <Description />
                  Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: darkMode ? 'text.primary' : 'inherit'
                    }}>
                      <AttachFile fontSize="small" />
                      <strong>Resume:</strong> {formData.resume ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                          <CheckCircle fontSize="small" />
                          {formData.resume.name}
                        </Box>
                      ) : (
                        <span style={{ color: 'error.main' }}>Not uploaded</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: darkMode ? 'text.primary' : 'inherit'
                    }}>
                      <Description fontSize="small" />
                      <strong>Cover Letter:</strong> {formData.coverLetter ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                          <CheckCircle fontSize="small" />
                          {formData.coverLetter.name}
                        </Box>
                      ) : (
                        <span style={{ color: darkMode ? 'text.secondary' : 'text.secondary' }}>Not uploaded</span>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Terms and Conditions */}
          <Grid item xs={12}>
            <Card sx={{ 
              ...getCardStyle(errors.termsAccepted || errors.privacyAccepted ? 'error.main' : 'primary.light'),
              background: errors.termsAccepted || errors.privacyAccepted 
                ? (darkMode ? '#d32f2f20' : '#ffebee')
                : (darkMode
                  ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
                  : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)')
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Terms & Conditions
                </Typography>
                
                <FormControl error={!!errors.termsAccepted} fullWidth sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.termsAccepted}
                        onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                        color={errors.termsAccepted ? 'error' : 'primary'}
                        sx={{
                          color: errors.termsAccepted ? 'error.main' : 'primary.main',
                        }}
                      />
                    }
                    label="I accept the terms and conditions and confirm that all information provided is accurate and complete"
                    sx={{ color: darkMode ? 'text.primary' : 'inherit' }}
                  />
                  <FormHelperText>{errors.termsAccepted}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.privacyAccepted} fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.privacyAccepted}
                        onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                        color={errors.privacyAccepted ? 'error' : 'primary'}
                        sx={{
                          color: errors.privacyAccepted ? 'error.main' : 'primary.main',
                        }}
                      />
                    }
                    label="I accept the privacy policy and consent to the processing of my personal data for recruitment purposes"
                    sx={{ color: darkMode ? 'text.primary' : 'inherit' }}
                  />
                  <FormHelperText>{errors.privacyAccepted}</FormHelperText>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default ReviewSubmission;