import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const Plans = ({ darkMode }) => {
  const theme = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleBillingChange = (event, newBilling) => {
    if (newBilling !== null) {
      setBillingCycle(newBilling);
    }
  };

  const billingPlans = {
    monthly: {
      name: 'Monthly',
      popular: false,
      price: 3999, // ₹3,999
      originalPrice: 5999, // ₹5,999
      credits: 25000,
      features: [
        '25,000 Monthly Credits',
        'All Default Features Included',
        'Super Feature: Business Name of IP Address',
        'Advanced Analytics',
        // 'API Access',
        // 'Priority Support',
        // 'Custom Integrations',
      ],
    },
    quarterly: {
      name: 'Quarterly',
      popular: false,
      price: 10999, // ₹10,999
      originalPrice: 15999, // ₹15,999
      credits: 75000,
      features: [
        '75,000 Quarterly Credits',
        'All Default Features Included',
        'Super Feature: Business Name of IP Address',
        'Advanced Analytics',
        // 'API Access',
        // 'Priority Support',
        // 'Custom Integrations',
        // 'Save 10% compared to monthly',
      ],
    },
    halfYearly: {
      name: 'Half Yearly',
      popular: true,
      price: 20999, // ₹20,999
      originalPrice: 29999, // ₹29,999
      credits: 150000,
      features: [
        '150,000 Half Yearly Credits',
        'All Default Features Included',
        'Super Feature: Business Name of IP Address',
        'Advanced Analytics',
        // 'API Access',
        // 'Priority Support',
        // 'Custom Integrations',
        // 'Advanced AI Models',
        // 'Save 20% compared to monthly',
      ],
    },
    yearly: {
      name: 'Yearly',
      popular: false,
      price: 38999, // ₹38,999
      originalPrice: 54999, // ₹54,999
      credits: 300000,
      features: [
        '300,000 Yearly Credits',
        'All Default Features Included',
        'Super Feature: Business Name of IP Address',
        'Advanced Analytics',
        // 'API Access',
        // 'Priority Support',
        // 'Custom Integrations',
        // 'Advanced AI Models',
        // 'Dedicated Account Manager',
        // 'Save 30% compared to monthly',
      ],
    },
  };

  const getDiscount = (cycle) => {
    const discounts = {
      quarterly: 10,
      halfYearly: 20,
      yearly: 30,
    };
    return discounts[cycle] || 0;
  };

  const currentPlan = billingPlans[billingCycle];

  // Format INR currency with Indian numbering system
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      py: { xs: 2, md: 4 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'text.primary',
              mb: 2,
            }}
          >
            Choose Your Plan
          </Typography>
        </Box>

        {currentPlan?.popular && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label="Most Popular Choice"
              sx={{
                bgcolor: darkMode ? '#FF9800' : '#1976D2',
                color: 'white',
                fontWeight: 600,
                px: 2,
                py: 1,
                fontSize: '0.9rem',
              }}
            />
          </Box>
        )}

        {/* Billing Cycle Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              width: '100%',
              maxWidth: '600px',
            }}
          >
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={handleBillingChange}
              sx={{
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  px: { xs: 1, md: 2 },
                  py: 1.5,
                  border: 'none',
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  fontWeight: 500,
                  borderRadius: 2,
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    bgcolor: darkMode ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                    color: darkMode ? '#90CAF9' : '#1976D2',
                    border: `1px solid ${darkMode ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}`,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                  },
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  },
                },
              }}
            >
              <ToggleButton value="monthly">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Monthly
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Flexible
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="quarterly">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Quarterly
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                    Save 10%
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="halfYearly">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Half Yearly
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                    Save 20%
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="yearly">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Yearly
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                    Save 30%
                  </Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Box>

        {/* Main Pricing Card */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'visible',
              position: 'relative',
              bgcolor: 'background.paper',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              '&:focus': { outline: 'none' },
            }}
          >
            <CardContent sx={{ 
              p: { xs: 3, md: 4 },
              '&:last-child': { pb: { xs: 3, md: 4 } }
            }}>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  color: 'text.primary',
                }}
              >
                {currentPlan?.name} Plan
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Current Plan: Basic • Upgrade to get more features
              </Typography>

              {/* Pricing */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    display: 'inline',
                    mr: 2,
                    fontSize: { xs: '1.1rem', md: '1.5rem' }
                  }}
                >
                  {formatINR(currentPlan?.originalPrice)}
                </Typography>
                <Typography
                  variant="h2"
                  component="span"
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    background: darkMode 
                      ? 'linear-gradient(45deg, #FF9800, #F57C00)'
                      : 'linear-gradient(45deg, #1976D2, #0D47A1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {formatINR(currentPlan?.price)}
                </Typography>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ 
                    ml: 1, 
                    color: 'text.secondary',
                    fontSize: { xs: '0.9rem', md: '1.1rem' }
                  }}
                >
                  {billingCycle === 'monthly' ? '/month' : 
                   billingCycle === 'quarterly' ? 'every 3 months' :
                   billingCycle === 'halfYearly' ? 'every 6 months' : '/year'}
                </Typography>
              </Box>

              {/* Credits Display */}
              <Box sx={{ 
                textAlign: 'center', 
                mb: 4,
                p: 2,
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                >
                  {currentPlan?.credits.toLocaleString()} Credits
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {billingCycle === 'monthly' ? 'Renews monthly' : 
                   billingCycle === 'quarterly' ? 'Total for 3 months' :
                   billingCycle === 'halfYearly' ? 'Total for 6 months' : 'Total for 12 months'}
                </Typography>
              </Box>

              {/* Features */}
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon sx={{ 
                    color: darkMode ? '#4CAF50' : '#2E7D32', 
                    flexShrink: 0,
                    mt: 0.25 
                  }} />
                  <Typography variant="body1">
                    <strong>{currentPlan?.credits.toLocaleString()} Credits</strong> • {
                      billingCycle === 'monthly' ? 'Monthly allocation' :
                      billingCycle === 'quarterly' ? 'Quarterly allocation' :
                      billingCycle === 'halfYearly' ? 'Half-yearly allocation' : 'Yearly allocation'
                    }
                  </Typography>
                </Box>
                {currentPlan?.features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  >
                    <CheckCircleIcon sx={{ 
                      color: darkMode ? '#4CAF50' : '#2E7D32', 
                      flexShrink: 0,
                      mt: 0.25 
                    }} />
                    <Typography variant="body1">{feature}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Upgrade Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  bgcolor: darkMode ? '#FF9800' : '#1976D2',
                  color: 'white',
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  border: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:hover': {
                    bgcolor: darkMode ? '#F57C00' : '#1565C0',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Upgrade to {currentPlan?.name} Plan - {formatINR(currentPlan?.price)}
                {billingCycle !== 'monthly' && ` (${billingCycle})`}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mt: 2,
              px: { xs: 2, sm: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              lineHeight: 1.5,
            }}
          >
            {billingCycle !== 'monthly' ? (
              <>
                * Billed {billingCycle === 'quarterly' ? 'quarterly' : billingCycle === 'halfYearly' ? 'semi-annually' : 'annually'}. 
                You save {getDiscount(billingCycle)}% compared to monthly billing.
                <br />
              </>
            ) : null}
            All plans include a 14-day free trial. No credit card required to start.
            Cancel or change your plan anytime.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Plans;