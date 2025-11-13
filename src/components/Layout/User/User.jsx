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
  Container
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Email,
  Person 
} from '@mui/icons-material';
import AddUser from '../Adduser/Adduser';
import { getUsers, deleteUser, initializeUsers } from '../../../services/userService';

const User = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddUser = (newUser) => {
    setShowAddUser(false);
    loadUsers();
    showSnackbar('User added successfully!');
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      const newName = prompt('Enter new name:', userToEdit.name);
      const newEmail = prompt('Enter new email:', userToEdit.email);
      const newRole = prompt('Enter new role (HR/Interviewer):', userToEdit.role);
      
      if (newName && newEmail && newRole) {
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, name: newName, email: newEmail, role: newRole }
            : user
        );
        setUsers(updatedUsers);
        showSnackbar('User updated successfully!');
      }
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        showSnackbar('User deleted successfully!');
        
        // Adjust page if needed after deletion
        const maxPage = Math.ceil((users.length - 1) / rowsPerPage) - 1;
        if (page > maxPage) {
          setPage(Math.max(0, maxPage));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar('Error deleting user', 'error');
      }
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

  // Calculate paginated users
  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(users.length / rowsPerPage);

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

      {/* Main Content Container */}
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
                {users.length} user{users.length !== 1 ? 's' : ''} total • Page {page + 1} of {totalPages}
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
                        onClick={() => handleEditUser(user.id)}
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
                        onClick={() => handleDeleteUser(user.id)}
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
                              onClick={() => handleEditUser(user.id)}
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
                              onClick={() => handleDeleteUser(user.id)}
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
              count={users.length}
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
        {isMobile && users.length > 0 && (
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
                Showing {paginatedUsers.length} of {users.length} users
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Empty State */}
        {users.length === 0 && (
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
                No Users Found
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 5, opacity: 0.8, maxWidth: 500, mx: 'auto' }}>
                Get started by adding your first user to the system. Users can be HR managers or Interviewers.
              </Typography>
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
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default User;