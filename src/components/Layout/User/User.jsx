// src/Admin/components/Users/Users.jsx
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
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  TablePagination,
  Pagination,
  Stack,
  Container,
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
  Email,
  Person,
  Search,
  Close
} from '@mui/icons-material';
import AddUser from '../Adduser/Adduser';
import { getUsers, deleteUser, initializeUsers, updateUser } from '../../../services/userService';

const User = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = () => {
    setLoading(true);
    try {
      // Initialize with sample data if empty
      initializeUsers();

      const usersData = getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      showSnackbar('Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when searching
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = (newUser) => {
    setShowAddUser(false);
    loadUsers();
    showSnackbar('User added successfully!');
  };

  // Edit User Functions
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.role.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    try {
      // Update user in the service
      updateUser(editingUser.id, editFormData);

      // Update local state
      const updatedUsers = users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...editFormData }
          : user
      );
      setUsers(updatedUsers);

      setEditModalOpen(false);
      setEditingUser(null);
      showSnackbar('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user', 'error');
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({ name: '', email: '', role: '' });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete User Functions
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    try {
      deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      showSnackbar('User deleted successfully!');

      // Adjust page if needed after deletion
      const maxPage = Math.ceil((users.length - 1) / rowsPerPage) - 1;
      if (page > maxPage) {
        setPage(Math.max(0, maxPage));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user', 'error');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
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

  // Mobile pagination handler
  const handleMobilePageChange = (event, value) => {
    setPage(value - 1);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'HR':
        return 'primary';
      case 'Interviewer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate paginated users from filtered results
  const displayUsers = searchTerm ? filteredUsers : users;
  const paginatedUsers = displayUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(displayUsers.length / rowsPerPage);

  if (showAddUser) {
    return (
      <AddUser
        darkMode={darkMode}
        onSave={handleAddUser}
        onCancel={() => setShowAddUser(false)}
      />
    );
  }

  if (loading) {
    return (
      <Box sx={{
        p: isMobile ? 2 : 3,
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
      {/* Snackbar for notifications */}
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





      <Dialog
        open={editModalOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.background.paper,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Edit User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}> {/* Added margin-top */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Full Name"
              value={editFormData.name}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1.1rem'
                }
              }}
              InputLabelProps={{
                sx: {
                  // Ensure label stays within its container
                  position: 'relative',
                  transform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 1
                }
              }}
            />
            <TextField
              label="Email Address"
              type="email"
              value={editFormData.email}
              onChange={(e) => handleEditFormChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1.1rem'
                }
              }}
              InputLabelProps={{
                sx: {
                  position: 'relative',
                  transform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 1
                }
              }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{
                position: 'relative',
                transform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: theme.palette.text.secondary,
                mb: 1
              }}>
                Role
              </InputLabel>
              <Select
                value={editFormData.role}
                onChange={(e) => handleEditFormChange('role', e.target.value)}
                sx={{
                  borderRadius: 2,
                  fontSize: '1.1rem'
                }}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Interviewer">Interviewer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={handleEditCancel}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                bgcolor: theme.palette.primary.main + '10'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>



      {/* Simple Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            margin: { xs: 2, sm: 3 },
            width: { xs: 'calc(100% - 32px)', sm: '400px' }
          }
        }}
      >
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Delete
            sx={{
              fontSize: 48,
              color: theme.palette.error.main,
              mb: 2
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Delete User?
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                bgcolor: theme.palette.action.hover,
              },
              minWidth: '100px'
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: theme.palette.error.main,
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                background: theme.palette.error.dark,
                boxShadow: 'none',
              },
              minWidth: '100px'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rest of your component remains exactly the same */}
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{
          mb: 4,
          width: '100%'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            width: '100%'
          }}>
            {/* Title Section */}
            <Box sx={{
              flex: 1,
              minWidth: 0,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  background: darkMode
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                User Management
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''} total • Page {page + 1} of {totalPages}
                {searchTerm && ` • ${filteredUsers.length} result${filteredUsers.length !== 1 ? 's' : ''} found`}
              </Typography>
            </Box>

            {/* Add User Button */}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddUser(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' },
                flexShrink: 0,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add User
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{
            mt: 4,
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 500 }
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  fontSize: '1rem',
                  bgcolor: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Users Table/Cards */}
        {isMobile ? (
          // Mobile View - Cards
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            maxWidth: '100%'
          }}>
            {paginatedUsers.map((user) => (
              <Card
                key={user.id}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 50,
                        height: 50,
                        mr: 3,
                        fontSize: '1rem',
                        flexShrink: 0,
                        fontWeight: 600
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          wordWrap: 'break-word',
                          fontSize: '1.1rem'
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Email sx={{
                          fontSize: 18,
                          mr: 1,
                          color: theme.palette.text.secondary,
                          flexShrink: 0
                        }} />
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.95rem'
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="medium"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          height: '28px'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 2
                  }}>
                    <Tooltip title="Edit User">
                      <IconButton
                        size="medium"
                        onClick={() => handleEditClick(user)}
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: theme.palette.primary.main + '15',
                          '&:hover': {
                            bgcolor: theme.palette.primary.main + '30',
                          }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="medium"
                        onClick={() => handleDeleteClick(user)}
                        sx={{
                          color: theme.palette.error.main,
                          bgcolor: theme.palette.error.main + '15',
                          '&:hover': {
                            bgcolor: theme.palette.error.main + '30',
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          // Desktop View - Table
          <Paper
            sx={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <TableContainer>
              <Table sx={{
                minWidth: 800
              }}>
                <TableHead>
                  <TableRow sx={{
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                  }}>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>
                      User
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>
                      Email
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>
                      Role
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      py: 3,
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      borderBottom: `2px solid ${theme.palette.primary.main}`
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': {
                          background: theme.palette.action.hover
                        },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 50,
                              height: 50,
                              mr: 3,
                              fontSize: '1.1rem',
                              fontWeight: 600
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{
                            fontSize: 22,
                            mr: 2,
                            color: theme.palette.text.secondary
                          }} />
                          <Typography variant="body1" sx={{ fontSize: '1.05rem' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 3 }}>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            height: '32px',
                            minWidth: '100px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Edit User">
                            <IconButton
                              size="medium"
                              onClick={() => handleEditClick(user)}
                              sx={{
                                color: theme.palette.primary.main,
                                bgcolor: theme.palette.primary.main + '15',
                                '&:hover': {
                                  bgcolor: theme.palette.primary.main + '30',
                                }
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="medium"
                              onClick={() => handleDeleteClick(user)}
                              sx={{
                                color: theme.palette.error.main,
                                bgcolor: theme.palette.error.main + '15',
                                '&:hover': {
                                  bgcolor: theme.palette.error.main + '30',
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Desktop Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={displayUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  padding: 3,
                  fontSize: '1rem'
                }
              }}
            />
          </Paper>
        )}

        {/* Mobile Pagination */}
        {isMobile && displayUsers.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            width: '100%'
          }}>
            <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handleMobilePageChange}
                color="primary"
                size={isMobile ? "medium" : "large"}
                showFirstButton
                showLastButton
              />
              <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ fontWeight: 500 }}>
                Showing {paginatedUsers.length} of {displayUsers.length} users
                {searchTerm && ` (${filteredUsers.length} found)`}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Empty State */}
        {displayUsers.length === 0 && (
          <Card
            sx={{
              textAlign: 'center',
              py: 10,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              width: '100%',
              maxWidth: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }}
          >
            <CardContent>
              <Person sx={{
                fontSize: 100,
                color: theme.palette.primary.main,
                mb: 4,
                opacity: 0.7
              }} />
              <Typography variant="h3" color="textPrimary" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {searchTerm ? 'No Users Found' : 'No Users Found'}
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 5, opacity: 0.8, maxWidth: 500, mx: 'auto' }}>
                {searchTerm
                  ? `No users found for "${searchTerm}". Try searching with different terms.`
                  : 'Get started by adding your first user to the system. Users can be HR managers or Interviewers.'
                }
              </Typography>
              {searchTerm ? (
                <Button
                  variant="outlined"
                  onClick={clearSearch}
                  sx={{
                    borderRadius: 2,
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      bgcolor: theme.palette.primary.main + '10'
                    }
                  }}
                >
                  Clear Search
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddUser(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Add First User
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default User;