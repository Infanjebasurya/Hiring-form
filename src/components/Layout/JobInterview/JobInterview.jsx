// src/components/JobInterview/JobInterview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayCircleOutline as InProgressIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

// Enhanced API service with better pagination
const jobInterviewsApi = {
  getJobInterviews: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    
    // Add some mock data if empty
    if (data.length === 0) {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        jobId: `JOB${String(i + 1).padStart(3, '0')}`,
        jdLink: `http://company.com/jd/${i + 1}`,
        interviewRounds: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          id: Date.now() + j,
          name: `Round ${j + 1}`,
          interviewer: 'Rajesh R (rajesh@company.com)',
          isSelfAssigned: Math.random() > 0.5,
        })),
        rounds: Math.floor(Math.random() * 5) + 1,
        status: ['In progress', 'Done', 'Pending'][Math.floor(Math.random() * 3)],
        candidates: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        team: ['JD', 'MJ', 'AR'].slice(0, Math.floor(Math.random() * 3) + 1),
      }));
      localStorage.setItem('jobInterviews', JSON.stringify(mockData));
      data = mockData;
    }

    // Apply filtering based on params
    let filteredData = [...data];
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(row =>
        row.jobId.toLowerCase().includes(searchTerm) ||
        row.jdLink.toLowerCase().includes(searchTerm) ||
        row.status.toLowerCase().includes(searchTerm)
      );
    }

    if (params.statusFilter && params.statusFilter !== 'all') {
      filteredData = filteredData.filter(row => row.status === params.statusFilter);
    }

    // Apply sorting
    if (params.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[params.sortBy];
        const bValue = b[params.sortBy];
        
        if (params.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Get total count for pagination
    const total = filteredData.length;
    
    // Apply pagination
    const startIndex = (params.page || 0) * (params.limit || 10);
    const endIndex = startIndex + (params.limit || 10);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page: params.page || 0,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    };
  },

  getStatistics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    
    return {
      totalInterviews: data.length,
      inProgress: data.filter(item => item.status === 'In progress').length,
      completed: data.filter(item => item.status === 'Done').length,
      pending: data.filter(item => item.status === 'Pending').length,
      averageRounds: data.length > 0 
        ? (data.reduce((sum, item) => sum + item.rounds, 0) / data.length).toFixed(1)
        : 0,
      totalCandidates: data.reduce((sum, item) => sum + item.candidates, 0),
    };
  },

  deleteJobInterview: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    const updatedData = data.filter(item => item.id !== id);
    localStorage.setItem('jobInterviews', JSON.stringify(updatedData));
    
    return { success: true, message: 'Job interview deleted successfully' };
  },
};

const JobInterviews = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State for data
  const [jobInterviews, setJobInterviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  // Fetch job interviews with all parameters
  const fetchJobInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction,
      };
      
      const response = await jobInterviewsApi.getJobInterviews(params);
      setJobInterviews(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to fetch job interviews. Please try again.');
      console.error('Error fetching job interviews:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, sortConfig]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      const stats = await jobInterviewsApi.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatisticsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchJobInterviews();
    fetchStatistics();
  }, [fetchJobInterviews, fetchStatistics]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchJobInterviews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchJobInterviews]);

  // Handle page change
  useEffect(() => {
    fetchJobInterviews();
  }, [page, rowsPerPage, fetchJobInterviews]);

  // Handle sort change
  useEffect(() => {
    fetchJobInterviews();
  }, [sortConfig, fetchJobInterviews]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
    handleFilterClose();
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleActionClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedRow) {
        await jobInterviewsApi.deleteJobInterview(selectedRow.id);
        
        // Refresh data
        fetchJobInterviews();
        fetchStatistics();
        
        setSnackbar({
          open: true,
          message: `Job interview "${selectedRow.jobId}" deleted successfully`,
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete job interview',
        severity: 'error'
      });
      console.error('Error deleting job interview:', err);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleRefresh = () => {
    fetchJobInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success'
    });
  };

  const handleNewJob = () => {
    navigate('/createNewProcess');
  };

  const handleEditJob = () => {
    if (selectedRow) {
      navigate(`/edit-job-interview/${selectedRow.id}`, { 
        state: { editData: selectedRow } 
      });
    }
    handleActionClose();
  };

  const handleViewDetails = () => {
    if (selectedRow) {
      navigate(`/job-interviews/${selectedRow.id}`);
      setSnackbar({
        open: true,
        message: `Viewing details for ${selectedRow.jobId}`,
        severity: 'info'
      });
    }
    handleActionClose();
  };

  const handleAddCandidate = () => {
    if (selectedRow) {
      setSnackbar({
        open: true,
        message: `Add candidate to ${selectedRow.jobId}`,
        severity: 'info'
      });
    }
    handleActionClose();
  };

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem('jobInterviews') || '[]');
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, `job_interviews_${new Date().toISOString().split('T')[0]}.csv`);
    
    setSnackbar({
      open: true,
      message: `Exported ${data.length} records successfully`,
      severity: 'success'
    });
  };

  const convertToCSV = (data) => {
    const headers = ['Job ID', 'JD Link', 'Rounds', 'Status', 'Candidates', 'Created At', 'Team'];
    const rows = data.map(item => [
      item.jobId,
      item.jdLink,
      item.rounds,
      item.status,
      item.candidates,
      new Date(item.createdAt).toLocaleDateString(),
      item.team.join(', ')
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      'Done': { color: 'success', icon: <CheckCircleIcon fontSize="small" />, bgcolor: '#d4edda' },
      'In progress': { color: 'primary', icon: <InProgressIcon fontSize="small" />, bgcolor: '#d1ecf1' },
      'Pending': { color: 'warning', icon: <PendingIcon fontSize="small" />, bgcolor: '#fff3cd' },
    };

    const config = statusConfig[status] || { color: 'default', icon: null, bgcolor: '#e2e3e5' };

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        sx={{
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: 'inherit',
          },
        }}
      />
    );
  };

  // Enhanced Statistics Cards
  const stats = statistics ? [
    { 
      label: 'Total Interviews', 
      value: statistics.totalInterviews.toString(), 
      subLabel: `${statistics.averageRounds} avg rounds`,
      color: '#667eea', 
      progress: 100,
      icon: <WorkIcon />,
    },
    { 
      label: 'In Progress', 
      value: statistics.inProgress.toString(), 
      subLabel: `${((statistics.inProgress / statistics.totalInterviews) * 100).toFixed(1)}% of total`,
      color: '#4caf50', 
      progress: statistics.totalInterviews > 0 ? (statistics.inProgress / statistics.totalInterviews) * 100 : 0,
      icon: <InProgressIcon />,
    },
    { 
      label: 'Completed', 
      value: statistics.completed.toString(), 
      subLabel: `${statistics.totalCandidates} candidates`,
      color: '#2196f3', 
      progress: statistics.totalInterviews > 0 ? (statistics.completed / statistics.totalInterviews) * 100 : 0,
      icon: <CheckCircleIcon />,
    },
    { 
      label: 'Pending', 
      value: statistics.pending.toString(), 
      subLabel: 'Awaiting action',
      color: '#ff9800', 
      progress: statistics.totalInterviews > 0 ? (statistics.pending / statistics.totalInterviews) * 100 : 0,
      icon: <PendingIcon />,
    },
  ] : [];

  // Sort indicator component
  const SortIndicator = ({ field }) => {
    if (sortConfig.field !== field) return null;
    
    return (
      <SortIcon 
        sx={{ 
          ml: 1, 
          fontSize: '0.875rem',
          transform: sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }} 
      />
    );
  };

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchJobInterviews}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      bgcolor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Job Interviews
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all your job interview processes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 2,
                bgcolor: '#fff',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statisticsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  bgcolor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 3 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  bgcolor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="600">
                        {stat.value}
                      </Typography>
                      {stat.subLabel && (
                        <Typography variant="caption" color="text.secondary">
                          {stat.subLabel}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha('#000', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Actions Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          p: 3,
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by Job ID, Status..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f8f9fa',
                '&:hover': {
                  bgcolor: '#f1f3f4',
                }
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              border: '1px solid rgba(0,0,0,0.23)',
              bgcolor: '#fff',
              '&:hover': {
                bgcolor: '#f8f9fa',
              }
            }}
          >
            Filter {statusFilter !== 'all' && `(${statusFilter})`}
          </Button>
          <Chip
            label={`${totalCount} total`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewJob}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            New Job
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              bgcolor: '#fff',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f8f9fa',
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
          }
        }}
      >
        <MenuItem 
          onClick={() => handleStatusFilter('all')}
          selected={statusFilter === 'all'}
          sx={{ 
            fontWeight: statusFilter === 'all' ? 600 : 400,
            borderRadius: 1,
            mx: 1,
            my: 0.5,
          }}
        >
          All Status
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusFilter('In progress')}
          selected={statusFilter === 'In progress'}
          sx={{ 
            fontWeight: statusFilter === 'In progress' ? 600 : 400,
            borderRadius: 1,
            mx: 1,
            my: 0.5,
          }}
        >
          <InProgressIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
          In Progress
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusFilter('Done')}
          selected={statusFilter === 'Done'}
          sx={{ 
            fontWeight: statusFilter === 'Done' ? 600 : 400,
            borderRadius: 1,
            mx: 1,
            my: 0.5,
          }}
        >
          <CheckCircleIcon fontSize="small" sx={{ mr: 1.5, color: 'success.main' }} />
          Done
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusFilter('Pending')}
          selected={statusFilter === 'Pending'}
          sx={{ 
            fontWeight: statusFilter === 'Pending' ? 600 : 400,
            borderRadius: 1,
            mx: 1,
            my: 0.5,
          }}
        >
          <PendingIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} />
          Pending
        </MenuItem>
      </Menu>

      {/* Table */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          minHeight: 400,
          position: 'relative',
          mb: 4,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        bgcolor: '#f8fafc',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f3f4' }
                      }}
                      onClick={() => handleSort('jobId')}
                    >
                      Job ID
                      <SortIndicator field="jobId" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>
                      JD Link
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        bgcolor: '#f8fafc',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f3f4' }
                      }}
                      onClick={() => handleSort('rounds')}
                    >
                      Rounds
                      <SortIndicator field="rounds" />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        bgcolor: '#f8fafc',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f3f4' }
                      }}
                      onClick={() => handleSort('status')}
                    >
                      Status
                      <SortIndicator field="status" />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600, 
                        bgcolor: '#f8fafc',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f3f4' }
                      }}
                      onClick={() => handleSort('candidates')}
                    >
                      Candidates
                      <SortIndicator field="candidates" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>
                      Actions
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc' }}>
                        Team
                      </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', width: 60 }}>
                      {/* More options */}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobInterviews.length > 0 ? (
                    jobInterviews.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: alpha('#000', 0.02),
                          },
                          '&:last-child td': {
                            borderBottom: 0,
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color="primary">
                            {row.jobId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon fontSize="small" sx={{ color: 'primary.main' }} />
                            <Tooltip title={row.jdLink}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'primary.main',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  '&:hover': {
                                    color: 'primary.dark',
                                  },
                                }}
                                onClick={() => window.open(row.jdLink, '_blank')}
                              >
                                {row.jdLink}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.rounds}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontWeight: 600,
                              borderRadius: '6px',
                              minWidth: '36px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={row.status} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="600">
                              {row.candidates}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<PersonAddIcon fontSize="small" />}
                              sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                fontSize: '0.75rem',
                                borderRadius: 1,
                                textTransform: 'none',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRow(row);
                                handleAddCandidate();
                              }}
                            >
                              Add
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'primary.main',
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRow(row);
                                  handleActionClick(e, row);
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'warning.main',
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRow(row);
                                  navigate(`/edit-job-interview/${row.id}`, { 
                                    state: { editData: row } 
                                  });
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  color: 'error.main',
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.2),
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRow(row);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                              {row.team && row.team.map((initial, index) => (
                                <Avatar
                                  key={index}
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    bgcolor: '#667eea',
                                    '&:first-of-type': {
                                      bgcolor: '#4caf50',
                                    },
                                    '&:nth-of-type(2)': {
                                      bgcolor: '#2196f3',
                                    },
                                  }}
                                >
                                  {initial}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                          </TableCell>
                        )}
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionClick(e, row)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'text.primary',
                                bgcolor: alpha('#000', 0.05),
                              }
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 7 : 8}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            No job interviews found
                          </Typography>
                          {searchTerm ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              No results for "{searchTerm}". Try a different search term.
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              Get started by creating your first job interview process.
                            </Typography>
                          )}
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleNewJob}
                            sx={{ 
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                          >
                            Create New Job Interview
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Enhanced Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(0,0,0,0.1)',
                '& .MuiTablePagination-toolbar': {
                  minHeight: '60px',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                }
              }}
              labelRowsPerPage="Rows per page:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} of ${count}`
              }
            />
          </>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem 
          onClick={handleViewDetails} 
          sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={handleEditJob} 
          sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2, color: 'warning.main' }} />
          Edit Job
        </MenuItem>
        <MenuItem 
          onClick={handleAddCandidate} 
          sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
        >
          <PersonAddIcon fontSize="small" sx={{ mr: 2, color: 'info.main' }} />
          Add Candidate
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedRow) {
              navigator.clipboard.writeText(selectedRow.jdLink);
              setSnackbar({
                open: true,
                message: 'Link copied to clipboard',
                severity: 'success'
              });
              handleActionClose();
            }
          }} 
          sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 2, color: 'success.main' }} />
          Share Link
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleDeleteClick} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Delete Job Interview
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main',
              }}
            >
              <DeleteIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {selectedRow?.jobId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRow?.rounds} rounds • {selectedRow?.candidates} candidates
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            Are you sure you want to delete this job interview? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            All associated data including interview rounds will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f8f9fa',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#d32f2f',
              }
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Quick Stats Footer */}
      {statistics && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          mt: 2,
          pt: 2,
          borderTop: '1px solid rgba(0,0,0,0.1)',
          flexWrap: 'wrap'
        }}>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.totalInterviews}</strong> Total Interviews
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.averageRounds}</strong> Average Rounds
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.totalCandidates}</strong> Total Candidates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{((statistics.completed / statistics.totalInterviews) * 100).toFixed(1)}%</strong> Completion Rate
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JobInterviews;