// src/Admin/components/Organizations/Organizations.jsx
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
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Business
} from '@mui/icons-material';
import { 
  getOrganizations, 
  addOrganization, 
  updateOrganization, 
  deleteOrganization,
  initializeOrganizations 
} from '../../../services/organizationService';

const Organizations = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    status: 'active'
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
      initializeOrganizations();
      const orgsData = getOrganizations();
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
      org.name.toLowerCase().includes(searchLower)
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
    setFormData({ name: '', status: 'active' });
    setModalOpen(true);
  };

  const handleEditClick = (org) => {
    setEditingOrg(org);
    setFormData({ name: org.name, status: org.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showSnackbar('Please enter organization name', 'error');
      return;
    }

    try {
      if (editingOrg) {
        updateOrganization(editingOrg.id, formData);
        showSnackbar('Organization updated successfully!');
      } else {
        addOrganization(formData);
        showSnackbar('Organization added successfully!');
      }

      setModalOpen(false);
      loadOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      showSnackbar('Error saving organization', 'error');
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingOrg(null);
    setFormData({ name: '', status: 'active' });
  };

  // Delete Organization Functions
  const handleDeleteClick = (org) => {
    setOrgToDelete(org);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!orgToDelete) return;

    try {
      deleteOrganization(orgToDelete.id);
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

  const displayOrgs = searchTerm ? filteredOrganizations : organizations;
  const paginatedOrgs = displayOrgs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          {editingOrg ? 'Edit Organization' : 'Add New Organization'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
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
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {editingOrg ? 'Update' : 'Add'} Organization
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
                Manage organizations and their status
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
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Business />
                        <Typography variant="body1" fontWeight={500}>
                          {org.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.status}
                        color={getStatusColor(org.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditClick(org)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(org)}
                          color="error"
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
      </Box>
    </Box>
  );
};

export default Organizations;