// src/components/Admin/Organizations.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  TablePagination,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Avatar,
  Alert,
  Snackbar,
  Tooltip,
  Switch,
  alpha,
  MenuItem,
  FormControl,
  Container
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search as SearchIcon,
  Refresh,
  Business,
  Email,
  Phone,
  Language,
  LinkedIn,
  ToggleOn,
  ToggleOff,
  LocationOn,
  FilterList
} from '@mui/icons-material';
import AddOrganizationModal from '../Organizations/AddOrganizationModal';

// Mock data - Only 3 entries
const MOCK_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+91 9876543210',
    address: '123 Tech Park, Bangalore',
    website: 'https://techsolutions.com',
    linkedInUrl: 'https://linkedin.com/company/tech-solutions',
    currentRole: 'CEO',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Innovate Labs',
    email: 'hello@innovatelabs.com',
    phone: '+91 8765432109',
    address: '456 Innovation Street, Hyderabad',
    website: 'https://innovatelabs.com',
    linkedInUrl: 'https://linkedin.com/company/innovate-labs',
    currentRole: 'CTO',
    createdAt: '2024-02-20',
    isActive: true
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'info@globalent.com',
    phone: '+91 7654321098',
    address: '789 Corporate Tower, Mumbai',
    website: 'https://globalenterprises.com',
    linkedInUrl: 'https://linkedin.com/company/global-enterprises',
    currentRole: 'HR Director',
    createdAt: '2024-03-10',
    isActive: false
  }
];

// API Service
const apiService = {
  getOrganizations: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredOrgs = [...MOCK_ORGANIZATIONS];
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredOrgs = filteredOrgs.filter(org => 
          org.name.toLowerCase().includes(searchTerm) ||
          org.email.toLowerCase().includes(searchTerm) ||
          org.currentRole?.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by active status
      if (params.isActive !== undefined) {
        filteredOrgs = filteredOrgs.filter(org => org.isActive === params.isActive);
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        organizations: filteredOrgs.slice(startIndex, endIndex),
        totalCount: filteredOrgs.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return {
        organizations: MOCK_ORGANIZATIONS,
        totalCount: MOCK_ORGANIZATIONS.length
      };
    }
  },

  createOrganization: async (organizationData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newOrg = {
        id: Date.now().toString(),
        ...organizationData,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      
      return newOrg;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  updateOrganization: async (id, organizationData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedOrg = {
        id,
        ...organizationData
      };
      
      return updatedOrg;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  deleteOrganization: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  toggleOrganizationStatus: async (id, isActive) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true, isActive };
    } catch (error) {
      console.error('Error toggling organization status:', error);
      throw error;
    }
  }
};

const Organizations = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    organizations: true,
    action: false
  });

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Selected items
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgToDelete, setOrgToDelete] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Active options
  const activeOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active Only' },
    { id: 'inactive', label: 'Inactive Only' }
  ];

  // Load data on component mount and when filters change
  useEffect(() => {
    loadOrganizations();
  }, [page, rowsPerPage, activeFilter]);

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Load organizations
  const loadOrganizations = async () => {
    setLoading(prev => ({ ...prev, organizations: true }));
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        isActive: activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined
      };

      const data = await apiService.getOrganizations(params);
      setOrganizations(data.organizations || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error loading organizations:', error);
      showSnackbar('Error loading organizations', 'error');
    } finally {
      setLoading(prev => ({ ...prev, organizations: false }));
    }
  };

  // Handle search
  const handleSearch = () => {
    setPage(0);
    loadOrganizations();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setPage(0);
  };

  // Add/Edit Organization
  const handleAddClick = () => {
    setEditingOrg(null);
    setAddModalOpen(true);
  };

  const handleEditClick = (org) => {
    setEditingOrg(org);
    setAddModalOpen(true);
  };

  const handleSaveOrganization = async (formData) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      if (editingOrg) {
        const updatedOrg = await apiService.updateOrganization(editingOrg.id, formData);
        setOrganizations(prev => prev.map(org => 
          org.id === editingOrg.id ? { ...updatedOrg, isActive: org.isActive } : org
        ));
        showSnackbar('Organization updated successfully!', 'success');
      } else {
        const newOrg = await apiService.createOrganization(formData);
        setOrganizations(prev => [newOrg, ...prev]);
        setTotalCount(prev => prev + 1);
        showSnackbar('Organization created successfully!', 'success');
      }

      setAddModalOpen(false);
      setEditingOrg(null);
    } catch (error) {
      console.error('Error saving organization:', error);
      showSnackbar('Error saving organization', 'error');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Delete Organization
  const handleDeleteClick = (org) => {
    setOrgToDelete(org);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orgToDelete) return;

    setLoading(prev => ({ ...prev, action: true }));
    try {
      await apiService.deleteOrganization(orgToDelete.id);
      setOrganizations(prev => prev.filter(org => org.id !== orgToDelete.id));
      setTotalCount(prev => prev - 1);
      showSnackbar('Organization deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting organization:', error);
      showSnackbar('Error deleting organization', 'error');
    } finally {
      setDeleteModalOpen(false);
      setOrgToDelete(null);
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (org, isActive) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      await apiService.toggleOrganizationStatus(org.id, !isActive);
      
      setOrganizations(prev => prev.map(o => 
        o.id === org.id ? { ...o, isActive: !isActive } : o
      ));
      
      showSnackbar(
        `${org.name} ${isActive ? 'deactivated' : 'activated'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling organization status:', error);
      showSnackbar('Error updating organization status', 'error');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper functions
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Stats
  const stats = useMemo(() => {
    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter(o => o.isActive).length;

    return {
      totalOrgs,
      activeOrgs
    };
  }, [organizations]);

  return (
    <Container maxWidth="xl" sx={{ 
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1
        }}>
          Organizations
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage all organizations
        </Typography>
      </Box>

      {/* Stats Cards with Add Button in Top Right Corner */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ 
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Business sx={{ fontSize: 28, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.primary.main,
                    mb: 0.5
                  }}>
                    {stats.totalOrgs}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Total Organizations
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card sx={{ 
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Business sx={{ fontSize: 28, color: theme.palette.success.main }} />
                </Box>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.success.main,
                    mb: 0.5
                  }}>
                    {stats.activeOrgs}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Active Organizations
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Organization Button in Top Right Corner */}
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          [theme.breakpoints.down('sm')]: {
            position: 'relative',
            top: 'auto',
            right: 'auto',
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-start'
          }
        }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: '200px',
              height: '48px',
              whiteSpace: 'nowrap'
            }}
          >
            Add Organization
          </Button>
        </Box>
      </Box>

      {/* Search and Filters Section */}
      <Paper sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none'
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-input': {
                    py: 1.5,
                    fontSize: '1rem'
                  }
                }
              }}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-input': {
                    py: 1.5,
                    fontSize: '1rem'
                  }
                }}
              >
                {activeOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          
          {/* Buttons aligned with search fields */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              <Button
                variant="outlined"
                onClick={clearSearch}
                startIcon={<Refresh />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
                  height: '48px',
                  minWidth: '100px'
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<FilterList />}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  height: '48px',
                  minWidth: '120px'
                }}
              >
                Apply
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Organizations Table */}
      <Paper sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none'
      }}>
        {loading.organizations && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.default, 0.8),
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.primary.main, 0.04)
              }}>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  py: 3,
                  fontSize: '0.95rem',
                  borderBottom: `2px solid ${theme.palette.primary.main}`
                }}>Organization</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      py: 3,
                      fontSize: '0.95rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>Contact Info</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      py: 3,
                      fontSize: '0.95rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>Links</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      py: 3,
                      fontSize: '0.95rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>Role</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      py: 3,
                      fontSize: '0.95rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>Address</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      py: 3,
                      fontSize: '0.95rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>Status</TableCell>
                  </>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  py: 3,
                  fontSize: '0.95rem',
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textAlign: 'center' 
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {organizations.map((org) => (
                <TableRow 
                  key={org.id} 
                  hover
                  sx={{ 
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.03)' 
                        : 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <TableCell sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.primary.main,
                        fontWeight: 600,
                        width: 44,
                        height: 44,
                        fontSize: '1rem'
                      }}>
                        {getInitials(org.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          {org.name}
                        </Typography>
                        {isMobile && (
                          <>
                            <Typography variant="body2" color="textSecondary" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              mb: 1 
                            }}>
                              <Email sx={{ fontSize: 14 }} />
                              {org.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip
                                label={org.currentRole}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={org.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={org.isActive ? 'success' : 'error'}
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: 0.5,
                              mb: 1 
                            }}>
                              <LocationOn sx={{ fontSize: 14, mt: 0.25 }} />
                              {org.address}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleEditClick(org)}
                                  color="primary"
                                  size="small"
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDeleteClick(org)}
                                  color="error"
                                  size="small"
                                  sx={{ 
                                    bgcolor: alpha(theme.palette.error.main, 0.1)
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {!isMobile && (
                    <>
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: 'text.primary'
                          }}>
                            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {org.email}
                          </Typography>
                          {org.phone && (
                            <Typography variant="body2" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              color: 'text.primary'
                            }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              {org.phone}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {org.website && (
                            <Tooltip title="Visit Website">
                              <IconButton
                                size="small"
                                onClick={() => window.open(org.website, '_blank')}
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                                  }
                                }}
                              >
                                <Language fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {org.linkedInUrl && (
                            <Tooltip title="LinkedIn Profile">
                              <IconButton
                                size="small"
                                onClick={() => window.open(org.linkedInUrl, '_blank')}
                                sx={{ 
                                  color: '#0077B5',
                                  bgcolor: alpha('#0077B5', 0.1),
                                  '&:hover': {
                                    bgcolor: alpha('#0077B5', 0.2)
                                  }
                                }}
                              >
                                <LinkedIn fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell sx={{ py: 3 }}>
                        <Chip
                          label={org.currentRole}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      
                      <TableCell sx={{ py: 3 }}>
                        <Typography variant="body2" sx={{ 
                          color: 'text.primary',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          maxWidth: 200
                        }}>
                          <LocationOn sx={{ 
                            fontSize: 16, 
                            color: 'text.secondary',
                            mt: 0.25,
                            flexShrink: 0
                          }} />
                          {org.address}
                        </Typography>
                      </TableCell>
                      
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Switch
                            checked={org.isActive}
                            onChange={() => handleToggleActive(org, org.isActive)}
                            color="success"
                            size="small"
                          />
                          <Chip
                            label={org.isActive ? 'Active' : 'Inactive'}
                            color={org.isActive ? 'success' : 'error'}
                            variant="filled"
                            size="small"
                          />
                        </Box>
                      </TableCell>
                    </>
                  )}
                  
                  {!isMobile && (
                    <TableCell align="center" sx={{ py: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        gap: 1
                      }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditClick(org)}
                            color="primary"
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2)
                              }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteClick(org)}
                            color="error"
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.2)
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.9rem'
            }
          }}
        />
      </Paper>

      {/* Empty State */}
      {organizations.length === 0 && !loading.organizations && (
        <Paper sx={{ 
          textAlign: 'center', 
          py: 8,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          mt: 4
        }}>
          <Business sx={{ 
            fontSize: 64, 
            color: 'text.secondary', 
            mb: 2,
            opacity: 0.3
          }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
            {searchTerm ? 'No organizations found' : 'No organizations yet'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            {searchTerm ? 'Try adjusting your search terms or filters' : 'Get started by adding your first organization'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Add First Organization
            </Button>
          )}
        </Paper>
      )}

      {/* Add/Edit Organization Modal */}
      <AddOrganizationModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingOrg(null);
        }}
        onSubmit={handleSaveOrganization}
        loading={loading.action}
        editingOrg={editingOrg}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { 
            borderRadius: 3,
            width: '100%',
            maxWidth: '400px'
          }
        }}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.error.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <Delete sx={{ fontSize: 35, color: 'error.main' }} />
          </Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Delete Organization?
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Are you sure you want to delete <strong>{orgToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={() => setDeleteModalOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              px: 4,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading.action}
            sx={{ 
              borderRadius: 2, 
              px: 4,
              py: 1
            }}
          >
            {loading.action ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontSize: '1rem',
            py: 1
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Organizations;