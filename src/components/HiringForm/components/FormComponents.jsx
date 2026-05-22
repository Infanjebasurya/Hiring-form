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
  darkMode: _darkMode = false,
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
    data-theme-mode={_darkMode ? 'dark' : 'light'}
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
  darkMode: _darkMode = false,
  ...props
}) => (
  <FormControl fullWidth error={!!error} required={required} size={size} data-theme-mode={_darkMode ? 'dark' : 'light'}>
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
            fontWeight: 700,
            borderRadius: 1.25,
            backgroundColor: darkMode ? 'rgba(129, 140, 248, 0.10)' : 'transparent',
            border: darkMode ? '1px solid rgba(129, 140, 248, 0.28)' : '1px solid rgba(15, 23, 42, 0.14)',
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
  <Box sx={{ mb: 2.5 }}>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: subtitle ? 1 : 0,
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 0 }
    }}>
      <Box>
        <Typography variant="h6" color={color} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800 }}>
          {icon}
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionButton}
    </Box>
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
  return (
    <Alert
      severity={severity}
      sx={{
        mb: 3,
        background: darkMode ? 'rgba(15, 23, 42, 0.68)' : '#ffffff',
        border: '1px solid',
        borderColor: darkMode ? 'rgba(148, 163, 184, 0.20)' : 'rgba(15, 23, 42, 0.10)',
        color: 'text.primary',
        boxShadow: darkMode ? 'none' : '0 10px 28px rgba(15,23,42,0.05)',
        '& .MuiAlert-icon': {
          color: `${severity}.main`,
        },
      }}
      icon={icon}
    >
      <Typography variant="subtitle1" fontWeight={800}>
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
      borderColor: error ? 'error.main' : 'divider',
      borderWidth: error ? 2 : 1,
      height: '100%',
      background: error
        ? (darkMode ? 'rgba(239, 68, 68, 0.10)' : '#fef2f2')
        : (darkMode ? 'rgba(15, 23, 42, 0.64)' : '#ffffff'),
      transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
      boxShadow: error
        ? (darkMode ? '0 0 0 4px rgba(239, 68, 68, 0.16)' : '0 0 0 4px rgba(220, 38, 38, 0.10)')
        : 'none',
      '&:hover': {
        transform: 'translateY(-1px)',
        borderColor: error ? 'error.main' : 'primary.main',
        boxShadow: error
          ? (darkMode ? '0 0 0 4px rgba(239, 68, 68, 0.18)' : '0 0 0 4px rgba(220, 38, 38, 0.12)')
          : (darkMode ? '0 12px 30px rgba(0,0,0,0.22)' : '0 12px 30px rgba(15,23,42,0.08)')
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Warning sx={{ mr: 1, color: error ? 'error.main' : 'primary.main' }} />
        <Typography variant="h6" color={error ? 'error.main' : 'text.primary'} sx={{ fontWeight: 800 }}>
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
          sx={{ mb: 2, height: '44px' }}
        >
          {value ? `Change ${label}` : `Upload ${label}`}
        </Button>
      </label>

      {value && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.25,
          bgcolor: darkMode ? 'rgba(34, 197, 94, 0.12)' : 'rgba(5, 150, 105, 0.10)',
          border: '1px solid',
          borderColor: 'success.main',
          borderRadius: 1.5,
          gap: 1,
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
        {required ? 'Required - ' : 'Optional - '}
        Max file size: 5MB | Accepted formats: PDF, DOC, DOCX
      </Typography>
    </CardContent>
  </Card>
);
