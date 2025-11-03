import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

const MenuSection = ({ section, isOpen, onToggle, isSidebarCollapsed }) => {
  // Get icon component based on section
  const getSectionIcon = () => {
    switch (section.title) {
      case 'Avatars':
        return <PersonIcon fontSize="small" />;
      case 'Projects':
        return <FolderIcon fontSize="small" />;
      default:
        return <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>;
    }
  };

  // Get item icon based on content
  const getItemIcon = (item) => {
    if (item.title.includes('No avatars') || item.title.includes('No projects')) {
      return <CheckIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
    }
    if (item.title.includes('Explore') || item.title.includes('Create')) {
      return <AddIcon fontSize="small" sx={{ color: 'primary.main' }} />;
    }
    return null;
  };

  if (isSidebarCollapsed) {
    return (
      <Tooltip title={section.title} placement="right">
        <IconButton
          onClick={() => onToggle(section.id)}
          sx={{
            width: '100%',
            mb: 1,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover'
            }
          }}
        >
          {getSectionIcon()}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ mb: 0 }}>
      {/* Section Header with top and bottom divider lines - no gap */}
      <Box
        onClick={() => onToggle(section.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getSectionIcon()}
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: '500',
              fontSize: '0.875rem',
            }}
          >
            {section.title}
          </Typography>
        </Box>
        <Box
          sx={{
            color: 'text.secondary',
            padding: '4px',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              color: 'text.primary'
            }
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </Box>
      </Box>

      {/* Section Items - directly connected to header with bottom border */}
      <Box sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Collapse in={isOpen}>
          <Box sx={{ mt: 0 }}>
            {section.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  cursor: item.title.includes('Explore') || item.title.includes('Create') ? 'pointer' : 'default',
                  '&:hover': (item.title.includes('Explore') || item.title.includes('Create')) ? {
                    bgcolor: 'action.hover'
                  } : {}
                }}
              >
                {getItemIcon(item)}
                <Typography
                  variant="body2"
                  sx={{
                    color: item.title.includes('Explore') || item.title.includes('Create') 
                      ? 'primary.main' 
                      : 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    textDecoration: item.title.includes('Explore') || item.title.includes('Create') 
                      ? 'underline' 
                      : 'none',
                    '&:hover': (item.title.includes('Explore') || item.title.includes('Create')) ? {
                      color: 'primary.dark'
                    } : {}
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default MenuSection;