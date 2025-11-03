import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  Box,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Alert,
  Paper,
  Card,
  CardContent,
  FormHelperText
} from '@mui/material';
import {
  Delete,
  Add,
  Work,
  School,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Language,
  Public,
  CheckCircle,
  CloudUpload,
  Warning
} from '@mui/icons-material';

// Reusable Text Input Component
export const FormTextField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  type = 'text',
  placeholder = '',
  startAdornment,
  size = 'medium',
  multiline = false,
  rows = 1,
  maxRows = 6,
  darkMode = false,
  ...props
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={helperText}
    required={required}
    type={type}
    placeholder={placeholder}
    variant="outlined"
    size={size}
    multiline={multiline}
    rows={rows}
    maxRows={maxRows}
    InputProps={{
      startAdornment: startAdornment ? (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      ) : null,
    }}
    {...props}
  />
);

// Reusable Select Component
export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required = false,
  size = 'medium',
  darkMode = false,
  ...props
}) => (
  <FormControl fullWidth error={!!error} required={required} size={size}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={onChange} {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.icon && <Box component="span" sx={{ mr: 1 }}>{option.icon}</Box>}
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {helperText && (
      <FormHelperText error={!!error}>{helperText}</FormHelperText>
    )}
  </FormControl>
);

// Reusable Chip List Component
export const ChipList = ({ 
  items, 
  onRemove, 
  color = 'primary', 
  variant = 'outlined', 
  size = 'medium',
  darkMode = false 
}) => (
  <Grid container spacing={1}>
    {items.map((item, index) => (
      <Grid item key={index}>
        <Chip
          label={item}
          onDelete={() => onRemove(index)}
          color={color}
          variant={variant}
          size={size}
          deleteIcon={<Delete />}
          sx={{
            fontWeight: 'bold',
            backgroundColor: darkMode ? `rgba(144, 202, 249, 0.1)` : 'transparent',
            border: darkMode ? '1px solid rgba(144, 202, 249, 0.3)' : '1px solid rgba(0, 0, 0, 0.2)',
          }}
        />
      </Grid>
    ))}
  </Grid>
);

// Reusable Section Header Component
export const SectionHeader = ({ 
  icon, 
  title, 
  actionButton, 
  color = 'primary',
  subtitle 
}) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: subtitle ? 1 : 0,
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 0 }
    }}>
      <Typography variant="h6" color={color} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {title}
      </Typography>
      {actionButton}
    </Box>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

// Reusable Info Alert Component
export const InfoAlert = ({ 
  icon, 
  title, 
  children, 
  severity = 'info', 
  darkMode = false 
}) => {
  const alertStyles = {
    info: {
      dark: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)',
      light: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      borderColor: '#3949ab'
    },
    success: {
      dark: 'linear-gradient(135deg, #1b5e20 0%, #33691e 100%)',
      light: 'linear-gradient(135deg, #e8f5e8 0%, #f0f4c3 100%)',
      borderColor: '#388e3c'
    },
    warning: {
      dark: 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)',
      light: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
      borderColor: '#6d4c41'
    }
  };

  const styles = alertStyles[severity] || alertStyles.info;

  return (
    <Alert
      severity={severity}
      sx={{
        mb: 3,
        background: darkMode ? styles.dark : styles.light,
        border: '1px solid',
        borderColor: darkMode ? styles.borderColor : styles.borderColor,
        color: darkMode ? 'white' : 'inherit'
      }}
      icon={icon}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      {children}
    </Alert>
  );
};

// Reusable File Upload Component
export const FileUpload = ({
  label,
  value,
  onChange,
  error,
  accept,
  required = false,
  darkMode = false
}) => (
  <Card
    variant="outlined"
    sx={{
      borderColor: error ? 'error.main' : 'primary.main',
      height: '100%',
      background: error
        ? (darkMode ? '#d32f2f20' : '#ffebee')
        : (darkMode
          ? 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'),
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Warning sx={{ mr: 1, color: error ? 'error.main' : 'primary.main' }} />
        <Typography variant="h6" color={error ? 'error.main' : 'primary.main'}>
          {label} {required && '*'}
        </Typography>
      </Box>

      <input
        accept={accept}
        style={{ display: 'none' }}
        id={`${label.toLowerCase().replace(/\s+/g, '-')}-upload`}
        type="file"
        onChange={(e) => onChange(e.target.files[0])}
      />

      <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-upload`}>
        <Button
          variant="contained"
          component="span"
          startIcon={value ? <CheckCircle /> : <CloudUpload />}
          fullWidth
          color={error ? 'error' : 'primary'}
          sx={{ mb: 2, height: '50px' }}
        >
          {value ? `Change ${label}` : `Upload ${label}`}
        </Button>
      </label>

      {value && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          bgcolor: darkMode ? 'success.dark' : 'success.light',
          borderRadius: 1
        }}>
          <Typography variant="body2" sx={{ 
            color: darkMode ? 'success.light' : 'success.dark', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <CheckCircle fontSize="small" />
            {value.name}
          </Typography>
          <Typography variant="caption" sx={{ color: darkMode ? 'success.light' : 'success.dark' }}>
            {(value.size / (1024 * 1024)).toFixed(2)} MB
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
        {required ? '📄 Required - ' : '📝 Optional - '}
        Max file size: 5MB | Accepted formats: PDF, DOC, DOCX
      </Typography>
    </CardContent>
  </Card>
);