import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Business,
  CheckCircle,
  Upgrade,
  Email,
  People,
  CreditCard,
  Security,
  Support,
  Speed
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
        status: 'active',
        createdAt: new Date('2024-03-10').toISOString(),
        users: 8,
        credits: 5000
      }
    ];
    localStorage.setItem('organizations', JSON.stringify(defaultOrgs));
    return defaultOrgs;
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
  }
};

// Plan configurations matching your user Plans component
const PLANS = {
  basic: {
    name: 'Basic',
    price: 4899,
    credits: 25000,
    features: [
      '25,000 Monthly Credits',
      'Basic Email Support',
      'Standard Features',
      'Up to 50 Users',
      'Basic Analytics'
    ],
    color: 'primary',
    icon: <CreditCard />
  },
  premium: {
    name: 'Premium',
    price: 9899,
    credits: 75000,
    features: [
      '75,000 Monthly Credits',
      'Priority Support',
      'Advanced Features',
      'Up to 200 Users',
      'Advanced Analytics',
      'Custom Integrations',
      'API Access'
    ],
    color: 'secondary',
    icon: <Speed />
  },
  enterprise: {
    name: 'Enterprise',
    price: 19999,
    credits: 200000,
    features: [
      '200,000 Monthly Credits',
      '24/7 Dedicated Support',
      'All Premium Features',
      'Unlimited Users',
      'Custom Features',
      'White-label Solution',
      'SLA Guarantee',
      'Dedicated Account Manager'
    ],
    color: 'success',
    icon: <Security />
  }
};

const AdminPlanUpgrade = ({ darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form State
  const [formData, setFormData] = useState({
    organizationId: '',
    plan: 'basic'
  });

  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(PLANS.basic);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    // Update selected organization when organizationId changes
    if (formData.organizationId) {
      const org = organizations.find(o => o.id === formData.organizationId);
      setSelectedOrganization(org);
    } else {
      setSelectedOrganization(null);
    }
  }, [formData.organizationId, organizations]);

  useEffect(() => {
    // Update selected plan when plan changes
    setSelectedPlan(PLANS[formData.plan]);
  }, [formData.plan]);

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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOrganizationChange = (event) => {
    setFormData({ ...formData, organizationId: event.target.value });
  };

  const handlePlanChange = (event) => {
    setFormData({ ...formData, plan: event.target.value });
  };

  const handleUpgrade = () => {
    if (!formData.organizationId) {
      showSnackbar('Please select an organization', 'error');
      return;
    }

    try {
      organizationService.updateOrganization(formData.organizationId, { 
        plan: formData.plan 
      });
      
      showSnackbar(
        `Successfully upgraded ${selectedOrganization?.name} to ${selectedPlan.name} plan!`,
        'success'
      );
      
      // Reset form
      setFormData({
        organizationId: '',
        plan: 'basic'
      });
      
      // Reload organizations to get updated data
      loadOrganizations();
    } catch (error) {
      console.error('Error upgrading organization:', error);
      showSnackbar('Error upgrading organization plan', 'error');
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanColor = (plan) => {
    return PLANS[plan]?.color || 'primary';
  };

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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Admin - Upgrade Organization Plan
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Select an organization and choose a new plan to upgrade their subscription
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Upgrade Form */}
          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: theme.palette.background.paper,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Upgrade Organization Plan
              </Typography>

              {/* Organization Selection Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Organization</InputLabel>
                <Select
                  value={formData.organizationId}
                  onChange={handleOrganizationChange}
                  label="Select Organization"
                >
                  {organizations.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {getInitials(org.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {org.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Current: {PLANS[org.plan]?.name} • {org.users} users
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Plan Selection Dropdown */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Select Plan</InputLabel>
                <Select
                  value={formData.plan}
                  onChange={handlePlanChange}
                  label="Select Plan"
                >
                  <MenuItem value="basic">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        <CreditCard />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Basic Plan
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formatINR(PLANS.basic.price)} • {PLANS.basic.credits.toLocaleString()} credits
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="premium">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'secondary.main' }}>
                        <Speed />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Premium Plan
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formatINR(PLANS.premium.price)} • {PLANS.premium.credits.toLocaleString()} credits
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="enterprise">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'success.main' }}>
                        <Security />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Enterprise Plan
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formatINR(PLANS.enterprise.price)} • {PLANS.enterprise.credits.toLocaleString()} credits
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Selected Organization Info */}
              {selectedOrganization && (
                <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business color="primary" />
                      Organization Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Organization Name
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedOrganization.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Current Plan
                        </Typography>
                        <Chip 
                          label={PLANS[selectedOrganization.plan]?.name} 
                          color={getPlanColor(selectedOrganization.plan)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <Email sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedOrganization.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <People sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                          Users
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedOrganization.users} users
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade Summary */}
              {selectedOrganization && (
                <Card sx={{ mb: 3, border: `2px solid ${theme.palette.primary.main}`, bgcolor: `${theme.palette.primary.main}08` }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Upgrade Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">From:</Typography>
                      <Chip 
                        label={PLANS[selectedOrganization.plan]?.name} 
                        color={getPlanColor(selectedOrganization.plan)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">To:</Typography>
                      <Chip 
                        label={selectedPlan.name} 
                        color={getPlanColor(formData.plan)}
                        size="small"
                      />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={600}>
                        New Monthly Price:
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {formatINR(selectedPlan.price)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Upgrade />}
                onClick={handleUpgrade}
                disabled={!formData.organizationId}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabled,
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                {formData.organizationId ? 
                  `Upgrade ${selectedOrganization?.name} to ${selectedPlan.name}` : 
                  'Select Organization to Upgrade'
                }
              </Button>
            </Paper>
          </Grid>

          {/* Right Column - Plan Details */}
          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: theme.palette.background.paper,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                height: 'fit-content'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Plan Features & Pricing
              </Typography>

              <Grid container spacing={3}>
                {Object.entries(PLANS).map(([planKey, plan]) => (
                  <Grid item xs={12} key={planKey}>
                    <Card 
                      sx={{ 
                        border: formData.plan === planKey ? `2px solid ${theme.palette[plan.color].main}` : `1px solid ${theme.palette.divider}`,
                        background: formData.plan === planKey ? 
                          `${theme.palette[plan.color].main}10` : 
                          theme.palette.background.paper,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ 
                            color: theme.palette[plan.color].main,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {plan.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {plan.name}
                            </Typography>
                            <Typography variant="h4" color={plan.color} fontWeight={700}>
                              {formatINR(plan.price)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {plan.credits.toLocaleString()} credits monthly
                            </Typography>
                          </Box>
                          {formData.plan === planKey && (
                            <Chip 
                              label="Selected" 
                              color={plan.color} 
                              size="small"
                            />
                          )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <List dense>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle sx={{ color: theme.palette[plan.color].main, fontSize: 20 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Organization Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {organizations.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Organizations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary" fontWeight={700}>
                    {organizations.filter(org => org.plan === 'premium').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Premium Plans
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success" fontWeight={700}>
                    {organizations.filter(org => org.plan === 'enterprise').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Enterprise Plans
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {organizations.reduce((sum, org) => sum + org.users, 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminPlanUpgrade;