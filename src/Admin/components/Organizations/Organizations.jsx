import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Business,
  Upgrade,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

// Mock service functions for organizations
const organizationService = {
  getOrganizations: () => {
    const stored = localStorage.getItem('organizations');
    if (stored) return JSON.parse(stored);
    
    // Default organizations
    const defaultOrgs = [
      {
        id: '1',
        name: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0101',
        address: '123 Tech Street, San Francisco, CA',
        plan: 'basic',
        status: 'active',
        createdAt: new Date('2024-01-15').toISOString(),
        users: 45,
        credits: 10000
      },
      {
        id: '2',
        name: 'Global Innovations Ltd',
        email: 'info@globalinnovations.com',
        phone: '+44-20-7946-0958',
        address: '456 Innovation Ave, London, UK',
        plan: 'premium',
        status: 'active',
        createdAt: new Date('2024-02-20').toISOString(),
        users: 120,
        credits: 50000
      },
      {
        id: '3',
        name: 'StartUp Ventures',
        email: 'hello@startupventures.com',
        phone: '+1-555-0102',
        address: '789 Startup Blvd, Austin, TX',
        plan: 'basic',
        status: 'inactive',
        createdAt: new Date('2024-03-10').toISOString(),
        users: 8,
        credits: 5000
      }
    ];
    localStorage.setItem('organizations', JSON.stringify(defaultOrgs));
    return defaultOrgs;
  },

  addOrganization: (org) => {
    const orgs = organizationService.getOrganizations();
    const newOrg = {
      ...org,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      users: 0,
      credits: 0
    };
    orgs.push(newOrg);
    localStorage.setItem('organizations', JSON.stringify(orgs));
    return newOrg;
  },

  updateOrganization: (id, updates) => {
    const orgs = organizationService.getOrganizations();
    const index = orgs.findIndex(org => org.id === id);
    if (index !== -1) {
      orgs[index] = { ...orgs[index], ...updates };
      localStorage.setItem('organizations', JSON.stringify(orgs));
      return orgs[index];
    }
    return null;
  },

  deleteOrganization: (id) => {
    const orgs = organizationService.getOrganizations();
    const filtered = orgs.filter(org => org.id !== id);
    localStorage.setItem('organizations', JSON.stringify(filtered));
    return true;
  }
};

// Plan configurations
const PLANS = {
  basic: {
    name: 'Basic',
    price: 4899,
    credits: 25000,
    features: ['25,000 Credits', 'Basic Support', 'Standard Features'],
    color: 'primary'
  },
  premium: {
    name: 'Premium',
    price: 9899,
    credits: 75000,
    features: ['75,000 Credits', 'Priority Support', 'Advanced Features'],
    color: 'secondary'
  },
  enterprise: {
    name: 'Enterprise',
    price: 19999,
    credits: 200000,
    features: ['200,000 Credits', '24/7 Support', 'Custom Features'],
    color: 'success'
  }
};

const Organizations = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const [orgToUpgrade, setOrgToUpgrade] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    plan: 'basic',
    status: 'active'
  });

  // Upgrade Form State
  const [upgradeData, setUpgradeData] = useState({
    plan: 'basic'
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [organizations, searchTerm]);

  const loadOrganizations = () => {
    setLoading(true);
    try {
      const orgsData = organizationService.getOrganizations();
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Error loading organizations:', error);
      showSnackbar('Error loading organizations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizations = () => {
    if (!searchTerm.trim()) {
      setFilteredOrganizations(organizations);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = organizations.filter(org =>
      org.name.toLowerCase().includes(searchLower) ||
      org.email.toLowerCase().includes(searchLower) ||
      org.plan.toLowerCase().includes(searchLower)
    );
    setFilteredOrganizations(filtered);
    setPage(0);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add/Edit Organization Functions
  const handleAddClick = () => {
    setEditingOrg(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'basic',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleEditClick = (org) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      email: org.email,
      phone: org.phone,
      address: org.address,
      plan: org.plan,
      status: org.status
    });
    setModalOpen(true);
  };

  const handleUpgradeClick = (org) => {
    setOrgToUpgrade(org);
    setUpgradeData({ plan: org.plan });
    setUpgradeModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showSnackbar('Please enter organization name and email', 'error');
      return;
    }

    try {
      if (editingOrg) {
        organizationService.updateOrganization(editingOrg.id, formData);
        showSnackbar('Organization updated successfully!');
      } else {
        organizationService.addOrganization(formData);
        showSnackbar('Organization added successfully!');
      }

      setModalOpen(false);
      loadOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      showSnackbar('Error saving organization', 'error');
    }
  };

  const handleUpgrade = () => {
    if (!orgToUpgrade) return;

    try {
      organizationService.updateOrganization(orgToUpgrade.id, { plan: upgradeData.plan });
      showSnackbar(`Organization plan upgraded to ${PLANS[upgradeData.plan].name} successfully!`);
      setUpgradeModalOpen(false);
      setOrgToUpgrade(null);
      loadOrganizations();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      showSnackbar('Error upgrading organization plan', 'error');
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingOrg(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      plan: 'basic',
      status: 'active'
    });
  };

  const handleUpgradeCancel = () => {
    setUpgradeModalOpen(false);
    setOrgToUpgrade(null);
    setUpgradeData({ plan: 'basic' });
  };

  // Delete Organization Functions
  const handleDeleteClick = (org) => {
    setOrgToDelete(org);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!orgToDelete) return;

    try {
      organizationService.deleteOrganization(orgToDelete.id);
      setOrganizations(organizations.filter(org => org.id !== orgToDelete.id));
      showSnackbar('Organization deleted successfully!');
    } catch (error) {
      console.error('Error deleting organization:', error);
      showSnackbar('Error deleting organization', 'error');
    } finally {
      setDeleteModalOpen(false);
      setOrgToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setOrgToDelete(null);
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getPlanColor = (plan) => {
    return PLANS[plan]?.color || 'default';
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayOrgs = searchTerm ? filteredOrganizations : organizations;
  const paginatedOrgs = displayOrgs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
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
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add/Edit Organization Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCancel}
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            {editingOrg ? 'Edit Organization' : 'Add New Organization'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Organization Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
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
                <InputLabel>Plan</InputLabel>
                <Select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  label="Plan"
                >
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
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
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {editingOrg ? 'Update' : 'Add'} Organization
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Plan Modal */}
      <Dialog
        open={upgradeModalOpen}
        onClose={handleUpgradeCancel}
        maxWidth="sm"
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Upgrade Plan
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            {orgToUpgrade?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Select Plan</InputLabel>
            <Select
              value={upgradeData.plan}
              onChange={(e) => setUpgradeData({ plan: e.target.value })}
              label="Select Plan"
            >
              <MenuItem value="basic">Basic - {formatINR(PLANS.basic.price)}</MenuItem>
              <MenuItem value="premium">Premium - {formatINR(PLANS.premium.price)}</MenuItem>
              <MenuItem value="enterprise">Enterprise - {formatINR(PLANS.enterprise.price)}</MenuItem>
            </Select>
          </FormControl>

          {upgradeData.plan && (
            <Card sx={{ mt: 3, bgcolor: theme.palette.background.default }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {PLANS[upgradeData.plan].name} Plan
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatINR(PLANS[upgradeData.plan].price)}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {PLANS[upgradeData.plan].credits.toLocaleString()} Credits
                </Typography>
                <Divider sx={{ my: 2 }} />
                {PLANS[upgradeData.plan].features.map((feature, index) => (
                  <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    • {feature}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={handleUpgradeCancel}
            variant="outlined"
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
            onClick={handleUpgrade}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Upgrade Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
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
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
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

          {/* Search */}
          <Box sx={{ mt: 3, maxWidth: 400 }}>
            <TextField
              fullWidth
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={clearSearch}>
                    <Close />
                  </IconButton>
                )
              }}
            />
          </Box>
        </Box>

        {/* Organizations Table */}
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Organization</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Users</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrgs.map((org) => (
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
                            Since {new Date(org.createdAt).toLocaleDateString()}
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
                      <Chip
                        label={PLANS[org.plan]?.name || org.plan}
                        color={getPlanColor(org.plan)}
                        variant="outlined"
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {formatINR(PLANS[org.plan]?.price || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.status}
                        color={getStatusColor(org.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={600}>
                        {org.users}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {org.credits?.toLocaleString()} credits
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleUpgradeClick(org)}
                          color="success"
                          title="Upgrade Plan"
                        >
                          <Upgrade />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(org)}
                          color="primary"
                          title="Edit Organization"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(org)}
                          color="error"
                          title="Delete Organization"
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayOrgs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Empty State */}
        {displayOrgs.length === 0 && (
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
    </Box>
  );
};

export default Organizations;