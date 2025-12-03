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
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Autocomplete,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search as SearchIcon,
  Close,
  Business,
  Upgrade,
  Email,
  Phone,
  LocationOn,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpOutlineIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

// Mock data for development
const MOCK_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+91 9876543210',
    address: '123 Tech Park, Bangalore',
    plan: 'monthly',
    status: 'active',
    users: 15,
    credits: 25000,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Innovate Labs',
    email: 'hello@innovatelabs.com',
    phone: '+91 8765432109',
    address: '456 Innovation Street, Hyderabad',
    plan: 'quarterly',
    status: 'active',
    users: 45,
    credits: 75000,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'info@globalent.com',
    phone: '+91 7654321098',
    address: '789 Corporate Tower, Mumbai',
    plan: 'yearly',
    status: 'active',
    users: 120,
    credits: 200000,
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: 'StartUp Hub',
    email: 'support@startuphub.com',
    phone: '+91 6543210987',
    address: '321 Startup Valley, Pune',
    plan: 'monthly',
    status: 'inactive',
    users: 8,
    credits: 25000,
    createdAt: '2024-01-05'
  },
  {
    id: '5',
    name: 'Digital Solutions',
    email: 'sales@digitalsolutions.com',
    phone: '+91 5432109876',
    address: '987 Digital Lane, Chennai',
    plan: 'halfYearly',
    status: 'suspended',
    users: 32,
    credits: 150000,
    createdAt: '2024-02-15'
  }
];

// API Service with mock data fallback
const apiService = {
  // Organization endpoints
  getOrganizations: async (params = {}) => {
    try {
      // For now, use mock data
      console.log('Fetching organizations with params:', params);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter based on search
      let filteredOrgs = [...MOCK_ORGANIZATIONS];
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredOrgs = filteredOrgs.filter(org => 
          org.name.toLowerCase().includes(searchTerm) ||
          org.email.toLowerCase().includes(searchTerm) ||
          org.plan.toLowerCase().includes(searchTerm)
        );
      }
      
      // Pagination simulation
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
      // Return mock data as fallback
      return {
        organizations: MOCK_ORGANIZATIONS,
        totalCount: MOCK_ORGANIZATIONS.length
      };
    }
  },

  getOrganization: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const org = MOCK_ORGANIZATIONS.find(o => o.id === id);
      if (!org) throw new Error('Organization not found');
      return org;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  },

  createOrganization: async (organizationData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newOrg = {
        id: Date.now().toString(),
        ...organizationData,
        users: 0,
        credits: organizationData.credits || 25000,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      console.log('Creating organization:', newOrg);
      
      return newOrg;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  updateOrganization: async (id, organizationData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const orgIndex = MOCK_ORGANIZATIONS.findIndex(o => o.id === id);
      if (orgIndex === -1) throw new Error('Organization not found');
      
      const updatedOrg = {
        ...MOCK_ORGANIZATIONS[orgIndex],
        ...organizationData
      };
      
      console.log('Updating organization:', updatedOrg);
      
      return updatedOrg;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  deleteOrganization: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Deleting organization with id:', id);
      
      return true;
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  updateOrganizationPlan: async (id, planData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Updating plan for organization:', id, planData);
      
      return { success: true, plan: planData.plan };
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }
};

const Organizations = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // State
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState({
    organizations: true,
    action: false
  });

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Selected items
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const [orgToUpgrade, setOrgToUpgrade] = useState(null);

  // Upgrade modal state (same as user dashboard)
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [country, setCountry] = useState('India');
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [statusOptions] = useState([
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'suspended', label: 'Suspended' }
  ]);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'monthly',
    status: 'active',
    credits: 25000
  });

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Pricing data (same as user dashboard)
  const pricing = {
    monthly: {
      original: 6999,
      discounted: 4899,
      credits: 25000,
    },
    quarterly: {
      original: 18999,
      discounted: 13299,
      credits: 75000,
    },
    halfYearly: {
      original: 35999,
      discounted: 25199,
      credits: 150000,
    },
    yearly: {
      original: 58788,
      discounted: 41152,
      credits: 300000,
    },
  };

  const currentPrice = pricing[billingCycle];

  // Plan options for forms
  const planOptions = [
    { id: 'monthly', label: 'Monthly', credits: 25000 },
    { id: 'quarterly', label: 'Quarterly', credits: 75000 },
    { id: 'halfYearly', label: 'Half Yearly', credits: 150000 },
    { id: 'yearly', label: 'Yearly · Save 30%', credits: 300000 },
  ];

  // Snackbar handlers
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Load data on component mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  // Load organizations with pagination and search
  const loadOrganizations = async (params = {}) => {
    setLoading(prev => ({ ...prev, organizations: true }));
    try {
      const data = await apiService.getOrganizations({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        ...params
      });
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
    loadOrganizations({ page: 1 });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setPage(0);
    loadOrganizations({ page: 1, search: '' });
  };

  // Add/Edit Organization Functions
  const handleAddClick = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'monthly',
      status: 'active',
      credits: 25000
    });
    setModalOpen(true);
  };

  const handleEditClick = (org) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      email: org.email,
      phone: org.phone || '',
      address: org.address || '',
      plan: org.plan,
      status: org.status,
      credits: org.credits
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showSnackbar('Please enter organization name and email', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));
    try {
      if (editingOrg) {
        await apiService.updateOrganization(editingOrg.id, formData);
        showSnackbar('Organization updated successfully!', 'success');
      } else {
        await apiService.createOrganization(formData);
        showSnackbar('Organization added successfully!', 'success');
      }

      setModalOpen(false);
      loadOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      showSnackbar('Error saving organization', 'error');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Upgrade Plan Functions
  const handleUpgradeClick = (org) => {
    setOrgToUpgrade(org);
    setBillingCycle(org.plan || 'monthly');
    setUpgradeEmail(org.email);
    setUpgradeModalOpen(true);
  };

  const handleBillingChange = (event, newValue) => {
    setBillingCycle(newValue);
  };

  const handleUpgrade = async () => {
    if (!orgToUpgrade) return;

    if (!upgradeEmail.trim()) {
      showSnackbar('Please enter email address', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));
    try {
      const planData = {
        plan: billingCycle,
        billingCycle,
        email: upgradeEmail,
        country,
        voucherCode,
        businessName,
        address,
        vatNumber,
        firstName,
        lastName,
        upgradedAt: new Date().toISOString(),
        upgradedBy: 'admin'
      };

      await apiService.updateOrganizationPlan(orgToUpgrade.id, planData);

      showSnackbar(
        `Successfully upgraded ${orgToUpgrade.name} to ${billingCycle} billing plan!`,
        'success'
      );

      // Reset form
      setOrgToUpgrade(null);
      setBillingCycle('monthly');
      setUpgradeEmail('');
      setVoucherCode('');
      setBusinessName('');
      setAddress('');
      setVatNumber('');
      setFirstName('');
      setLastName('');
      setUpgradeModalOpen(false);
      
      // Refresh organizations data
      loadOrganizations();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      showSnackbar('Error upgrading organization plan', 'error');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Delete Organization Functions
  const handleDeleteClick = (org) => {
    setOrgToDelete(org);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orgToDelete) return;

    setLoading(prev => ({ ...prev, action: true }));
    try {
      await apiService.deleteOrganization(orgToDelete.id);
      showSnackbar('Organization deleted successfully!', 'success');
      loadOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      showSnackbar('Error deleting organization', 'error');
    } finally {
      setDeleteModalOpen(false);
      setOrgToDelete(null);
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadOrganizations({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    loadOrganizations({ page: 1, limit: newRowsPerPage });
  };

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'error',
      suspended: 'warning'
    };
    return colors[status] || 'default';
  };

  const getPlanColor = (plan) => {
    const colors = {
      monthly: 'primary',
      quarterly: 'secondary',
      halfYearly: 'warning',
      yearly: 'success'
    };
    return colors[plan] || 'primary';
  };

  const formatINR = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPlanPrice = (plan) => {
    return pricing[plan]?.discounted || 0;
  };

  const searchFieldOptions = [
    { id: 'all', label: 'All Fields' },
    { id: 'name', label: 'Organization Name' },
    { id: 'email', label: 'Email' },
    { id: 'plan', label: 'Plan' }
  ];

  if (loading.organizations && organizations.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'background.default',
      overflow: 'auto'
    }}>
      {/* Add/Edit Organization Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          textAlign: 'center'
        }}>
          <Box component="div">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {editingOrg ? 'Edit Organization' : 'Add New Organization'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Organization Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={planOptions}
                  value={planOptions.find(opt => opt.id === formData.plan) || planOptions[0]}
                  onChange={(event, value) => 
                    setFormData({ 
                      ...formData, 
                      plan: value?.id || 'monthly',
                      credits: value?.credits || 25000
                    })
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Billing Plan *"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...restProps } = props;
                    return (
                      <li key={key} {...restProps}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Chip 
                            label={option.label.includes('·') ? option.label.split('·')[0].trim() : option.label} 
                            size="small"
                            color={getPlanColor(option.id)}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {formatINR(getPlanPrice(option.id))}
                          </Typography>
                        </Box>
                      </li>
                    );
                  }}
                  noOptionsText="No plans found"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.id === formData.status) || null}
                  onChange={(event, value) => 
                    setFormData({ ...formData, status: value?.id || 'active' })
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField {...params} label="Status *" />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...restProps } = props;
                    return (
                      <li key={key} {...restProps}>
                        <Chip 
                          label={option.label} 
                          size="small"
                          color={getStatusColor(option.id)}
                        />
                      </li>
                    );
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={() => setModalOpen(false)}
            variant="outlined"
            disabled={loading.action}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading.action}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading.action ? (
              <CircularProgress size={24} color="inherit" />
            ) : editingOrg ? (
              'Update Organization'
            ) : (
              'Add Organization'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Plan Modal (SAME AS USER DASHBOARD DESIGN) */}
      <Dialog
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          py: 3,
          textAlign: 'center'
        }}>
          <Box component="div">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Upgrade Plan
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              {orgToUpgrade?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Current Plan: {orgToUpgrade?.plan}
            </Typography>
          </Box>

          {/* Billing Cycle Navigation Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={billingCycle}
              onChange={handleBillingChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTab-root': {
                  minHeight: 40,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  py: 0.8,
                  px: 1.5,
                  color: theme.palette.text.secondary,
                  borderRadius: 2,
                  margin: '0 2px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none !important',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(52, 152, 219, 0.15)'
                      : 'rgba(52, 152, 219, 0.1)',
                  },
                  '&.Mui-selected': {
                    color: '#fff',
                    fontWeight: 700,
                    backgroundColor: '#3498DB',
                    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab label="Monthly" value="monthly" />
              <Tab label="Quarterly" value="quarterly" />
              <Tab label="Half Yearly" value="halfYearly" />
              <Tab
                label={
                  <Box sx={{ textAlign: 'center' }}>
                    <div>Yearly</div>
                    <Box
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: billingCycle === 'yearly' ? '#fff' : '#2ECC71',
                        background: billingCycle === 'yearly'
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(46, 204, 113, 0.1)',
                        borderRadius: 1,
                        px: 0.4,
                        mt: 0.3,
                        lineHeight: 1.2,
                      }}
                    >
                      Save 30%
                    </Box>
                  </Box>
                }
                value="yearly"
              />
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      textDecoration: 'line-through',
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      opacity: 0.7,
                    }}
                  >
                    {formatINR(currentPrice.original)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '1.75rem' : '2.5rem',
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      lineHeight: 1,
                    }}
                  >
                    {formatINR(currentPrice.discounted)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      opacity: 0.8,
                    }}
                  >
                    {billingCycle === 'monthly' ? 'Monthly' :
                      billingCycle === 'quarterly' ? 'Quarterly' :
                        billingCycle === 'halfYearly' ? 'Half Yearly' : 'Yearly'}
                    <sup style={{ fontSize: '0.6rem' }}>1</sup>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ pl: { md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: isMobile ? 16 : 18, mt: 0.2 }} />
                  <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: theme.palette.text.primary, lineHeight: 1.4 }}>
                    <strong>{currentPrice.credits.toLocaleString()}</strong> Monthly Credits
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: isMobile ? 16 : 18, mt: 0.2 }} />
                  <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: theme.palette.text.primary, lineHeight: 1.4 }}>
                    <strong>All Default Features</strong> Included
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: isMobile ? 16 : 18, mt: 0.2 }} />
                  <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: theme.palette.text.primary, lineHeight: 1.4 }}>
                    <strong>Super Feature:</strong> Business Name of IP Address
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Form Section */}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.8, fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.8rem' }}>
                  Email Address <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter organization email"
                  value={upgradeEmail}
                  onChange={(e) => setUpgradeEmail(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.2,
                      bgcolor: theme.palette.background.default,
                      '& fieldset': { borderColor: theme.palette.divider },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB', borderWidth: 2 },
                    },
                    '& .MuiInputBase-input': { color: theme.palette.text.primary, py: 0.8, fontSize: '0.875rem' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.8rem' }}>
                    Country <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{ p: 0 }}>
                    <HelpOutlineIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.2,
                      bgcolor: theme.palette.background.default,
                      '& fieldset': { borderColor: theme.palette.divider },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3498DB', borderWidth: 2 },
                    },
                    '& .MuiInputBase-input': { color: theme.palette.text.primary, py: 0.8, fontSize: '0.875rem' },
                  }}
                >
                  <MenuItem value="Romania">🇷🇴 Romania</MenuItem>
                  <MenuItem value="USA">🇺🇸 USA</MenuItem>
                  <MenuItem value="India">🇮🇳 India</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={() => setUpgradeModalOpen(false)}
            variant="outlined"
            disabled={loading.action}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            variant="contained"
            disabled={loading.action}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading.action ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Upgrade to ${billingCycle} - ${formatINR(currentPrice.discounted)}`
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Delete sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Delete Organization?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Are you sure you want to delete {orgToDelete?.name}? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            All associated users and data will also be deleted.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={loading.action}
          >
            {loading.action ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Organizations
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Manage organizations and their subscription plans
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Add Organization
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              options={searchFieldOptions}
              value={searchFieldOptions.find(opt => opt.id === searchField) || searchFieldOptions[0]}
              onChange={(event, value) => setSearchField(value?.id || 'all')}
              getOptionLabel={(option) => option.label}
              sx={{ width: 200 }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Search Field" />
              )}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <li key={key} {...restProps}>
                    {option.label}
                  </li>
                );
              }}
            />
            <TextField
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={clearSearch}>
                    <Close />
                  </IconButton>
                )
              }}
              sx={{ flex: 1, minWidth: 250 }}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* Organizations Table */}
        <Paper sx={{ overflow: 'hidden', position: 'relative' }}>
          {loading.organizations && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              bgcolor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Organization</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Billing Plan</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Users</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(org.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {org.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Since {org.createdAt}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{org.email}</Typography>
                        </Box>
                        {org.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{org.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                          color={getPlanColor(org.plan)}
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {formatINR(getPlanPrice(org.plan))} • {org.credits?.toLocaleString()} credits
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.status}
                        color={getStatusColor(org.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={600}>
                        {org.users || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Active users
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleUpgradeClick(org)}
                          color="success"
                          title="Upgrade Plan"
                          size="small"
                        >
                          <Upgrade />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(org)}
                          color="primary"
                          title="Edit Organization"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(org)}
                          color="error"
                          title="Delete Organization"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Empty State */}
        {organizations.length === 0 && !loading.organizations && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Business sx={{ fontSize: 100, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {searchTerm ? 'No organizations found' : 'No organizations yet'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first organization'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddClick}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Add First Organization
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Organizations;