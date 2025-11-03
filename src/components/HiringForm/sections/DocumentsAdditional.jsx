import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Delete,
  Add,
  AttachFile,
  Description,
  Language,
  Interests,
  CloudUpload,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import { InfoAlert, SectionHeader, FileUpload, ChipList } from '../components/FormComponents';

const DocumentsAdditional = ({
  formData,
  errors,
  handleInputChange,
  handleFileUpload,
  handleAddLanguage,
  handleRemoveLanguage,
  handleAddHobby,
  handleRemoveHobby,
  darkMode = false,
  isSmallMobile = false
}) => {
  const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'native', label: 'Native' }
  ];

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ mt: 3 }}>
        <InfoAlert
          icon={<AttachFile />}
          title="Documents & Additional Information"
          darkMode={darkMode}
          severity="warning"
        >
          Upload your resume and cover letter, then complete your profile with languages and hobbies.
        </InfoAlert>

        {/* Documents Section */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            icon={<Description />}
            title="Required Documents"
          />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FileUpload
                label="Resume / CV"
                value={formData.resume}
                onChange={(file) => handleFileUpload('resume', file)}
                error={errors.resume}
                accept=".pdf,.doc,.docx"
                required={true}
                darkMode={darkMode}
              />
            </Grid>

            <Grid item xs={12}>
              <FileUpload
                label="Cover Letter"
                value={formData.coverLetter}
                onChange={(file) => handleFileUpload('coverLetter', file)}
                error={errors.coverLetter}
                accept=".pdf,.doc,.docx"
                required={false}
                darkMode={darkMode}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Languages Section */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            icon={<Language />}
            title="Languages"
          />

          <Paper sx={{
            p: 2,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)'
              : 'linear-gradient(135deg, #e8f5e8 0%, #f0f4c3 100%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Language"
                  value={formData.newLanguage}
                  onChange={(e) => handleInputChange('newLanguage', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddLanguage();
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., Spanish, French, Mandarin"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                  <InputLabel>Proficiency Level</InputLabel>
                  <Select
                    value={formData.proficiency}
                    label="Proficiency Level"
                    onChange={(e) => handleInputChange('proficiency', e.target.value)}
                    variant="outlined"
                  >
                    {proficiencyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={handleAddLanguage}
                  fullWidth
                  disabled={!formData.newLanguage.trim()}
                  startIcon={<Add />}
                  sx={{ height: isSmallMobile ? '40px' : '56px' }}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {formData.languages.length > 0 && (
            <ChipList
              items={formData.languages.map(lang => `${lang.name} (${lang.proficiency})`)}
              onRemove={handleRemoveLanguage}
              color="secondary"
              darkMode={darkMode}
              size={isSmallMobile ? "small" : "medium"}
            />
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Hobbies Section */}
        <Box>
          <SectionHeader
            icon={<Interests />}
            title="Hobbies & Interests"
          />

          <Paper sx={{
            p: 2,
            mb: 2,
            background: darkMode
              ? 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  label="Hobby/Interest"
                  value={formData.newHobby}
                  onChange={(e) => handleInputChange('newHobby', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddHobby();
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Interests color="primary" /></InputAdornment>,
                  }}
                  variant="outlined"
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="e.g., Photography, Hiking, Reading, Gaming"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={handleAddHobby}
                  fullWidth
                  disabled={!formData.newHobby.trim()}
                  startIcon={<Add />}
                  sx={{ height: isSmallMobile ? '40px' : '56px' }}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {formData.hobbies.length > 0 && (
            <ChipList
              items={formData.hobbies}
              onRemove={handleRemoveHobby}
              color="primary"
              darkMode={darkMode}
              size={isSmallMobile ? "small" : "medium"}
            />
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default DocumentsAdditional;