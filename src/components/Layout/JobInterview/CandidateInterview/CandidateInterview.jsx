// src/components/CandidateInterview/CandidateInterview.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  useTheme,
  useMediaQuery,
  TablePagination,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  Avatar,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Import separate components
import CandidateDetails from './CandidateDetails';
import EditCandidate from './EditCandidate';
import AddCandidate from './AddCandidate';
import DeleteConfirmation from './DeleteConfirmation';
import StatusChangeDialog from './StatusChangeDialog';

// API Service
const candidateInterviewsApi = {
  getCandidateInterviews: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    
    // Add mock data if empty
    if (data.length === 0) {
      const mockData = Array.from({ length: 50 }, (_, i) => {
        const statuses = ['Scheduled', 'Pending Feedback', 'Completed', 'Cancelled', 'No Show'];
        const interviewTypes = ['Technical Interview', 'Hiring Manager', 'Intro', 'HR Screening', 'Final Round'];
        const positions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const interviewType = interviewTypes[Math.floor(Math.random() * interviewTypes.length)];
        
        return {
          id: i + 1,
          candidateId: `CAND${String(i + 1).padStart(3, '0')}`,
          name: `Candidate ${i + 1}`,
          email: `candidate${i + 1}@email.com`,
          phone: `+1 (555) ${String(100 + i).padStart(3, '0')}-${String(1000 + i).padStart(4, '0')}`,
          position: positions[Math.floor(Math.random() * positions.length)],
          currentRound: interviewType,
          status: status,
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          interviewDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          interviewer: ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'David Wilson'][Math.floor(Math.random() * 4)],
          experience: `${Math.floor(Math.random() * 10) + 1} years`,
          source: ['LinkedIn', 'Referral', 'Career Page', 'Job Board'][Math.floor(Math.random() * 4)],
          rating: Math.floor(Math.random() * 5) + 1,
          notes: i % 3 === 0 ? 'Strong technical background' : '',
          resumeLink: `http://company.com/resumes/${i + 1}`,
          skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB'].slice(0, Math.floor(Math.random() * 5) + 1),
          education: i % 2 === 0 ? 'Bachelor in Computer Science' : 'Master in Software Engineering',
          location: ['New York', 'San Francisco', 'Remote', 'Chicago', 'Austin'][Math.floor(Math.random() * 5)],
          availability: ['Immediate', '2 Weeks', '1 Month', '3 Months'][Math.floor(Math.random() * 4)],
          expectedSalary: `$${Math.floor(Math.random() * 60) + 80}k`,
          feedback: i % 4 === 0 ? 'Strong cultural fit, excellent technical skills.' : '',
        };
      });
      localStorage.setItem('candidateInterviews', JSON.stringify(mockData));
      data = mockData;
    }

    // Apply filtering based on params
    let filteredData = [...data];
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(row =>
        row.name.toLowerCase().includes(searchTerm) ||
        row.email.toLowerCase().includes(searchTerm) ||
        row.position.toLowerCase().includes(searchTerm) ||
        row.currentRound.toLowerCase().includes(searchTerm) ||
        row.status.toLowerCase().includes(searchTerm)
      );
    }

    if (params.statusFilter && params.statusFilter.length > 0 && !params.statusFilter.includes('all')) {
      filteredData = filteredData.filter(row => params.statusFilter.includes(row.status));
    }

    if (params.positionFilter && params.positionFilter.length > 0) {
      filteredData = filteredData.filter(row => params.positionFilter.includes(row.position));
    }

    // Apply sorting
    if (params.sortBy) {
      filteredData.sort((a, b) => {
        let aValue = a[params.sortBy];
        let bValue = b[params.sortBy];
        
        if (params.sortBy === 'lastUpdated' || params.sortBy === 'interviewDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
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
    
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    
    const statusCounts = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    
    const positionCounts = data.reduce((acc, item) => {
      acc[item.position] = (acc[item.position] || 0) + 1;
      return acc;
    }, {});
    
    const interviewCounts = data.reduce((acc, item) => {
      acc[item.currentRound] = (acc[item.currentRound] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalCandidates: data.length,
      scheduled: statusCounts['Scheduled'] || 0,
      pendingFeedback: statusCounts['Pending Feedback'] || 0,
      completed: statusCounts['Completed'] || 0,
      cancelled: statusCounts['Cancelled'] || 0,
      averageRating: data.length > 0 
        ? (data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1)
        : 0,
      positions: Object.entries(positionCounts).map(([position, count]) => ({
        position,
        count,
        percentage: ((count / data.length) * 100).toFixed(1)
      })),
      interviewTypes: Object.entries(interviewCounts).map(([type, count]) => ({
        type,
        count,
        percentage: ((count / data.length) * 100).toFixed(1)
      }))
    };
  },

  updateCandidate: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.map(item => 
      item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : item
    );
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));
    
    return { success: true, message: 'Candidate updated successfully' };
  },

  deleteCandidateInterview: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.filter(item => item.id !== id);
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));
    
    return { success: true, message: 'Candidate interview deleted successfully' };
  },

  updateCandidateStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const updatedData = data.map(item => 
      item.id === id ? { ...item, status, lastUpdated: new Date().toISOString().split('T')[0] } : item
    );
    localStorage.setItem('candidateInterviews', JSON.stringify(updatedData));
    
    return { success: true, message: `Status updated to ${status}` };
  },
};

const CandidateInterview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for data
  const [candidateInterviews, setCandidateInterviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(['all']);
  const [positionFilter, setPositionFilter] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Modal states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Available positions for filter
  const availablePositions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist'
  ];

  // Available statuses
  const availableStatuses = [
    'Scheduled',
    'Pending Feedback',
    'Completed',
    'Cancelled',
    'No Show'
  ];

  // Fetch candidate interviews with all parameters
  const fetchCandidateInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
        statusFilter: statusFilter.includes('all') ? [] : statusFilter,
        positionFilter,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction,
      };
      
      const response = await candidateInterviewsApi.getCandidateInterviews(params);
      setCandidateInterviews(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to fetch candidate interviews. Please try again.');
      console.error('Error fetching candidate interviews:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, positionFilter, sortConfig]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      const stats = await candidateInterviewsApi.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setStatisticsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCandidateInterviews();
    fetchStatistics();
  }, [fetchCandidateInterviews, fetchStatistics]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchCandidateInterviews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchCandidateInterviews]);

  // Handle page change
  useEffect(() => {
    fetchCandidateInterviews();
  }, [page, rowsPerPage, fetchCandidateInterviews]);

  // Handle sort change
  useEffect(() => {
    fetchCandidateInterviews();
  }, [sortConfig, fetchCandidateInterviews]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterClose = () => {
    setFilterDialogOpen(false);
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setStatusFilter(['all']);
    } else {
      setStatusFilter(value);
    }
    setPage(0);
  };

  const handlePositionFilterChange = (event) => {
    const value = event.target.value;
    setPositionFilter(value);
    setPage(0);
  };

  const handleSort = (field) => {
    if (!isMobile) { // Only allow sorting on desktop
      setSortConfig(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
  };

  const handleActionClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
  };

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setDetailsOpen(true);
    handleActionClose();
  };

  const handleEditCandidate = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
    handleActionClose();
  };

  const handleStatusChange = (row) => {
    setSelectedRow(row);
    setStatusOpen(true);
    handleActionClose();
  };

  const handleDeleteCandidate = (row) => {
    setSelectedRow(row);
    setDeleteOpen(true);
    handleActionClose();
  };

  const handleAddCandidate = () => {
    setAddOpen(true);
  };

  const handleRefresh = () => {
    fetchCandidateInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success'
    });
  };

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem('candidateInterviews') || '[]');
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, `candidate_interviews_${new Date().toISOString().split('T')[0]}.csv`);
    
    setSnackbar({
      open: true,
      message: `Exported ${data.length} records successfully`,
      severity: 'success'
    });
  };

  const convertToCSV = (data) => {
    const headers = ['Candidate ID', 'Name', 'Email', 'Phone', 'Position', 'Current Round', 'Status', 'Last Updated', 'Interview Date', 'Interviewer', 'Experience', 'Source', 'Rating'];
    const rows = data.map(item => [
      item.candidateId,
      item.name,
      item.email,
      item.phone,
      item.position,
      item.currentRound,
      item.status,
      item.lastUpdated,
      item.interviewDate,
      item.interviewer,
      item.experience,
      item.source,
      item.rating
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

  const handleSuccess = (message) => {
    fetchCandidateInterviews();
    fetchStatistics();
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const handleError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      'Scheduled': { color: 'primary', icon: <ScheduleIcon fontSize="small" /> },
      'Pending Feedback': { color: 'warning', icon: <PendingIcon fontSize="small" /> },
      'Completed': { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      'Cancelled': { color: 'error', icon: <ScheduleIcon fontSize="small" /> },
      'No Show': { color: 'default', icon: <ScheduleIcon fontSize="small" /> },
    };

    const config = statusConfig[status] || { color: 'default', icon: null };

    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: 'inherit',
            marginLeft: '4px',
          },
        }}
      />
    );
  };

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

  // Enhanced Statistics Cards
  const stats = statistics ? [
    { 
      label: 'Total Candidates', 
      value: statistics.totalCandidates.toString(), 
      subLabel: `${statistics.averageRating} avg rating`,
      color: theme.palette.mode === 'dark' ? '#667eea' : '#667eea', 
      progress: 100,
      icon: <PersonIcon />,
    },
    { 
      label: 'Scheduled', 
      value: statistics.scheduled.toString(), 
      subLabel: `${((statistics.scheduled / statistics.totalCandidates) * 100).toFixed(1)}% of total`,
      color: '#2196f3', 
      progress: statistics.totalCandidates > 0 ? (statistics.scheduled / statistics.totalCandidates) * 100 : 0,
      icon: <ScheduleIcon />,
    },
    { 
      label: 'Pending Feedback', 
      value: statistics.pendingFeedback.toString(), 
      subLabel: 'Awaiting review',
      color: '#ff9800', 
      progress: statistics.totalCandidates > 0 ? (statistics.pendingFeedback / statistics.totalCandidates) * 100 : 0,
      icon: <PendingIcon />,
    },
    { 
      label: 'Completed', 
      value: statistics.completed.toString(), 
      subLabel: 'Interviews done',
      color: '#4caf50', 
      progress: statistics.totalCandidates > 0 ? (statistics.completed / statistics.totalCandidates) * 100 : 0,
      icon: <CheckCircleIcon />,
    },
  ] : [];

  // Mobile Card View Component
  const MobileCardView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, p: 2 }}>
      {candidateInterviews.map((row) => (
        <Card 
          key={row.id}
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: 48,
                  height: 48
                }}>
                  {row.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="600" color="text.primary" noWrap>
                    {row.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {row.email}
                  </Typography>
                </Box>
              </Box>
              <StatusChip status={row.status} />
            </Box>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Position
                </Typography>
                <Typography variant="body2" fontWeight="600" color="text.primary" noWrap>
                  {row.position}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Current Round
                </Typography>
                <Typography variant="body2" fontWeight="500" color="text.primary" noWrap>
                  {row.currentRound}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last Updated
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {row.lastUpdated}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Interview Date
                </Typography>
                <Typography variant="body2" fontWeight="500" color="text.primary">
                  {row.interviewDate}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small"
                    onClick={() => handleViewDetails(row)}
                    sx={{ 
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small"
                    onClick={() => handleEditCandidate(row)}
                    sx={{ 
                      color: 'warning.main',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteCandidate(row)}
                    sx={{ 
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleActionClick(e, row)}
                sx={{
                  color: 'text.secondary',
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        bgcolor: 'background.default'
      }}>
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchCandidateInterviews}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      bgcolor: 'background.default',
      minHeight: '100vh',
      pb: isMobile ? 8 : 0 // Add padding for FAB on mobile
    }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom color="text.primary">
              Candidate Interview Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all your candidate interviews
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Statistics Cards - Responsive Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statisticsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 2, borderRadius: 3 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="600" color="text.primary">
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
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
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
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 2,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Actions Bar - Responsive */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          p: { xs: 2, sm: 2 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 1px 3px rgba(0,0,0,0.3)' 
            : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            placeholder="Search candidates..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              width: { xs: '100%', sm: 250 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4',
                }
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
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
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
              }
            }}
          >
            Filter
          </Button>
          <Chip
            label={`${totalCount} total`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddCandidate}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                    : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Add Candidate
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                py: 1,
                bgcolor: 'background.paper',
                borderColor: theme.palette.divider,
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderColor: theme.palette.divider,
                }
              }}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>

      {/* Filter Dialog for Mobile */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleFilterClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            bgcolor: 'background.paper',
            width: isMobile ? '100%' : 400,
            maxHeight: isMobile ? '100%' : '80vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Filter Candidates
          </Typography>
          <IconButton onClick={handleFilterClose} size="small">
            <FilterIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Filter by Status
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={statusFilter}
              onChange={handleStatusFilterChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => selected.includes('all') ? 'All Status' : selected.join(', ')}
            >
              <MenuItem value="all">
                <Checkbox checked={statusFilter.includes('all')} />
                <ListItemText primary="All Status" primaryTypographyProps={{ color: 'text.primary' }} />
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={statusFilter.includes(status)} />
                  <ListItemText primary={status} primaryTypographyProps={{ color: 'text.primary' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Filter by Position
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              multiple
              value={positionFilter}
              onChange={handlePositionFilterChange}
              input={<OutlinedInput label="Position" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {availablePositions.map((position) => (
                <MenuItem key={position} value={position}>
                  <Checkbox checked={positionFilter.includes(position)} />
                  <ListItemText primary={position} primaryTypographyProps={{ color: 'text.primary' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="outlined"
            onClick={() => {
              setStatusFilter(['all']);
              setPositionFilter([]);
            }}
            sx={{ 
              borderRadius: 2,
              flex: 1,
              py: 1
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={handleFilterClose}
            sx={{ 
              borderRadius: 2,
              flex: 1,
              py: 1
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table for Desktop / Cards for Mobile */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 1px 3px rgba(0,0,0,0.3)' 
            : '0 1px 3px rgba(0,0,0,0.05)',
          minHeight: 400,
          position: 'relative',
          mb: 4,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="text.secondary">Loading candidates...</Typography>
          </Box>
        ) : (
          <>
            {isMobile ? (
              <MobileCardView />
            ) : (
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4' 
                          }
                        }}
                        onClick={() => handleSort('name')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          CANDIDATE
                          <SortIndicator field="name" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
                        POSITION
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
                        CURRENT ROUND
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4' 
                          }
                        }}
                        onClick={() => handleSort('status')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          STATUS
                          <SortIndicator field="status" />
                        </Box>
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                          cursor: 'pointer',
                          '&:hover': { 
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f3f4' 
                          }
                        }}
                        onClick={() => handleSort('lastUpdated')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          LAST UPDATED
                          <SortIndicator field="lastUpdated" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
                        INTERVIEW DATE
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidateInterviews.length > 0 ? (
                      candidateInterviews.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            },
                            '&:last-child td': {
                              borderBottom: 0,
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                {row.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600" color="text.primary">
                                  {row.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {row.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.position}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.dark',
                                fontWeight: 500,
                                borderRadius: '6px',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500" color="text.primary">
                              {row.currentRound}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.interviewer}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={row.status} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.primary">
                              {row.lastUpdated}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500" color="text.primary">
                              {row.interviewDate}
                            </Typography>
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
                                  onClick={() => handleViewDetails(row)}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <IconButton 
                                size="small"
                                onClick={(e) => handleActionClick(e, row)}
                                sx={{ 
                                  color: 'text.secondary',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.1),
                                  }
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              No candidate interviews found
                            </Typography>
                            {searchTerm ? (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                No results for "{searchTerm}". Try a different search term.
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Get started by adding your first candidate.
                              </Typography>
                            )}
                            <Button
                              variant="contained"
                              startIcon={<PersonAddIcon />}
                              onClick={handleAddCandidate}
                              sx={{ 
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                background: theme.palette.mode === 'dark'
                                  ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              }}
                            >
                              Add New Candidate
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination - Responsive */}
            <TablePagination
              rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  minHeight: '60px',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 2 : 0,
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 2 : 0,
                },
                '& .MuiTablePagination-actions': {
                  marginLeft: isMobile ? 0 : 'auto',
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                  color: 'text.primary',
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

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddCandidate}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
                : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            bgcolor: 'background.paper',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem 
          onClick={() => handleViewDetails(selectedRow)} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 2, color: 'primary.main' }} />
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => handleEditCandidate(selectedRow)} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 2, color: 'warning.main' }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange(selectedRow)} 
          sx={{ 
            borderRadius: 1, 
            mx: 1, 
            my: 0.5,
            color: 'text.primary',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <CheckCircleIcon fontSize="small" sx={{ mr: 2, color: 'info.main' }} />
          Change Status
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
        <MenuItem 
          onClick={() => handleDeleteCandidate(selectedRow)} 
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

      {/* Separate CRUD Components */}
      <CandidateDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        candidate={selectedRow}
      />

      <EditCandidate
        open={editOpen}
        onClose={() => setEditOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
      />

      <AddCandidate
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
        availablePositions={availablePositions}
        availableStatuses={availableStatuses}
      />

      <DeleteConfirmation
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
      />

      <StatusChangeDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        candidate={selectedRow}
        onSuccess={handleSuccess}
        onError={handleError}
        apiService={candidateInterviewsApi}
        availableStatuses={availableStatuses}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 12px rgba(0,0,0,0.15)',
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Quick Stats Footer */}
      {statistics && !isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap'
        }}>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.totalCandidates}</strong> Total Candidates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.scheduled}</strong> Scheduled
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.pendingFeedback}</strong> Pending Feedback
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.completed}</strong> Completed
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>{statistics.averageRating}</strong> Avg Rating
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CandidateInterview;