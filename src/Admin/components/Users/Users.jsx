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
  Stack
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Email,
  Person 
} from '@mui/icons-material';
import AddUser from './AddUser';
import { getUsers, deleteUser, initializeUsers } from '../../../services/userService';

const Users = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      p: isMobile ? 2 : 3, 
      width: isMobile ? '100%' : '170vh',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
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

      {/* Header */}
      <Card 
        sx={{ 
          mb: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%'
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0,
            width: '100%'
          }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                  wordWrap: 'break-word'
                }}
              >
                User Management
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: theme.palette.text.secondary,
                  wordWrap: 'break-word'
                }}
              >
                {users.length} user{users.length !== 1 ? 's' : ''} total • Page {page + 1} of {totalPages}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddUser(true)}
              sx={{
                background: theme.palette.primary.main,
                borderRadius: 1,
                px: 3,
                py: 1,
                '&:hover': {
                  background: theme.palette.primary.dark,
                },
                minWidth: isMobile ? '100%' : 'auto',
                flexShrink: 0
              }}
            >
              Add User
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table/Cards */}
      {isMobile ? (
        // Mobile View - Cards
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          width: '100%',
          maxWidth: '100%'
        }}>
          {paginatedUsers.map((user) => (
            <Card 
              key={user.id}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                      mr: 2,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        wordWrap: 'break-word'
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ 
                        fontSize: 14, 
                        mr: 0.5, 
                        color: theme.palette.text.secondary,
                        flexShrink: 0
                      }} />
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                    <Chip 
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit User">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user.id)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.main + '20',
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(user.id)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: theme.palette.error.main + '20',
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
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            minWidth: '1200px'
          }}
        >
          <TableContainer>
            <Table sx={{ 
              width: '100%', 
              minWidth: '1200px',
              tableLayout: 'fixed'
            }}>
              <TableHead>
                <TableRow sx={{ 
                  background: theme.palette.action.hover
                }}>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary, 
                    py: 3,
                    fontSize: '1rem',
                    width: '30%'
                  }}>
                    User
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary, 
                    py: 3,
                    fontSize: '1rem',
                    width: '40%'
                  }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary, 
                    py: 3,
                    fontSize: '1rem',
                    width: '20%'
                  }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary, 
                    py: 3,
                    fontSize: '1rem',
                    textAlign: 'center',
                    width: '10%'
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
                      }
                    }}
                  >
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 44,
                            height: 44,
                            mr: 3,
                            fontSize: '1rem',
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ 
                          fontSize: 20, 
                          mr: 2, 
                          color: theme.palette.text.secondary 
                        }} />
                        <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip 
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="medium"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          height: '32px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="medium"
                            onClick={() => handleEditUser(user.id)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: theme.palette.primary.main + '20',
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
                              '&:hover': {
                                bgcolor: theme.palette.error.main + '20',
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
                padding: 2
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
          mt: 3,
          width: '100%'
        }}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handleMobilePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="textSecondary" textAlign="center">
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
            py: 8,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            width: '100%',
            minWidth: isMobile ? 'auto' : '1200px'
          }}
        >
          <CardContent>
            <Person sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3, opacity: 0.5 }} />
            <Typography variant="h4" color="textSecondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              No users found
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 4, opacity: 0.7 }}>
              Get started by adding your first user to the system
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddUser(true)}
              sx={{
                background: theme.palette.primary.main,
                borderRadius: 1,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Add First User
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Users;