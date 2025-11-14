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

const Plans = ({ darkMode }) => {
  const theme = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleBillingChange = (event, newBilling) => {
    if (newBilling !== null) {
      setBillingCycle(newBilling);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      color: darkMode ? '#9E9E9E' : '#666666',
      credits: {
        monthly: 10000,
        quarterly: 30000,
        halfYearly: 60000,
        yearly: 120000,
      },
      price: {
        monthly: 29.99,
        quarterly: 79.99,
        halfYearly: 149.99,
        yearly: 289.99,
      },
      features: [
        'All Default Features Included',
        'Basic AI Models Access',
        'Standard Support',
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced',
      color: darkMode ? '#2196F3' : '#1976D2',
      credits: {
        monthly: 15000,
        quarterly: 45000,
        halfYearly: 90000,
        yearly: 180000,
      },
      price: {
        monthly: 39.99,
        quarterly: 109.99,
        halfYearly: 209.99,
        yearly: 399.99,
      },
      features: [
        'All Default Features Included',
        'Advanced AI Models',
        'Priority Support',
        'Custom Integrations',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      color: darkMode ? '#FF9800' : '#F57C00',
      popular: true,
      credits: {
        monthly: 25000,
        quarterly: 75000,
        halfYearly: 150000,
        yearly: 300000,
      },
      price: {
        monthly: 48.99,
        quarterly: 139.99,
        halfYearly: 269.99,
        yearly: 499.99,
      },
      originalPrice: {
        monthly: 69.99,
        quarterly: 199.99,
        halfYearly: 389.99,
        yearly: 749.99,
      },
      features: [
        '25,000 Monthly Credits',
        'All Default Features Included',
        'Super Feature: Business Name of IP Address',
        'Advanced Analytics',
        'API Access',
      ],
    },
    {
      id: 'proPlus',
      name: 'Pro Plus',
      color: darkMode ? '#9C27B0' : '#7B1FA2',
      credits: {
        monthly: 40000,
        quarterly: 120000,
        halfYearly: 240000,
        yearly: 480000,
      },
      price: {
        monthly: 79.99,
        quarterly: 219.99,
        halfYearly: 419.99,
        yearly: 799.99,
      },
      features: [
        'All Pro Features',
        'Unlimited AI Conversations',
        'Dedicated Account Manager',
        'Custom Model Training',
        'White-label Options',
      ],
    },
  ];

  const getDiscount = (cycle) => {
    const discounts = {
      quarterly: 10,
      halfYearly: 20,
      yearly: 30,
    };
    return discounts[cycle] || 0;
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      py: { xs: 2, md: 4 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Plan Selection Pills */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3,
          mt: { xs: 1, md: 2 }
        }}>
          <Paper
            elevation={1}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 3,
              maxWidth: '100%',
              justifyContent: 'center',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {plans.map((plan) => (
              <Button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 1,
                  textTransform: 'none',
                  color: selectedPlan === plan.id ? 'white' : 'text.primary',
                  bgcolor: selectedPlan === plan.id ? plan.color : 'transparent',
                  fontWeight: selectedPlan === plan.id ? 600 : 400,
                  borderRadius: 2,
                  minWidth: 'auto',
                  flex: { xs: '1 1 calc(50% - 8px)', md: 'none' },
                  maxWidth: { xs: 'calc(50% - 8px)', md: 'none' },
                  border: 'none',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:hover': {
                    bgcolor: selectedPlan === plan.id ? plan.color : 'action.hover',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `2px solid ${selectedPlan === plan.id ? 'white' : plan.color}`,
                    bgcolor: selectedPlan === plan.id ? 'white' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mr: 1,
                  }}
                >
                  {selectedPlan === plan.id && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: plan.color,
                      }}
                    />
                  )}
                </Box>
                {plan.name}
              </Button>
            ))}
          </Paper>
        </Box>

        {currentPlan?.popular && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip
              label="Most Popular Plan"
              sx={{
                bgcolor: darkMode ? '#FF9800' : '#F57C00',
                color: 'white',
                fontWeight: 600,
                px: 2,
                py: 1,
              }}
            />
          </Box>
        )}

        {/* Main Pricing Card */}
        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mb: 4,
        }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'background.paper',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              '&:focus': {
                outline: 'none',
              },
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
                Upgrade to {currentPlan?.name} Plan
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Current Plan: Basic
              </Typography>

              {/* Pricing */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                {currentPlan?.originalPrice?.[billingCycle] && (
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
                    ${currentPlan.originalPrice[billingCycle].toFixed(2)}
                  </Typography>
                )}
                <Typography
                  variant="h2"
                  component="span"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    background: darkMode 
                      ? 'linear-gradient(45deg, #FF9800, #F57C00)'
                      : 'linear-gradient(45deg, #1976D2, #0D47A1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  ${currentPlan?.price[billingCycle].toFixed(2)}
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
                  Monthly
                  {billingCycle !== 'monthly' && (
                    <sup style={{ fontSize: '0.7em' }}>*</sup>
                  )}
                </Typography>
              </Box>

              {/* Billing Cycle Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <ToggleButtonGroup
                  value={billingCycle}
                  exclusive
                  onChange={handleBillingChange}
                  sx={{
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 0.5,
                    borderRadius: 2,
                    '& .MuiToggleButton-root': {
                      px: { xs: 2, md: 3 },
                      py: 1,
                      border: 'none',
                      textTransform: 'none',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                      flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
                      borderRadius: 1,
                      color: 'text.primary',
                      '&.Mui-selected': {
                        bgcolor: darkMode ? '#1976D2' : '#1976D2',
                        color: 'white',
                        '&:hover': {
                          bgcolor: darkMode ? '#1565C0' : '#1565C0',
                        },
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    },
                  }}
                >
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="quarterly">
                    Quarterly • Save {getDiscount('quarterly')}%
                  </ToggleButton>
                  <ToggleButton value="halfYearly">
                    Half Yearly • Save {getDiscount('halfYearly')}%
                  </ToggleButton>
                  <ToggleButton value="yearly">
                    Yearly • Save {getDiscount('yearly')}%
                  </ToggleButton>
                </ToggleButtonGroup>
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
                    {currentPlan?.credits[billingCycle].toLocaleString()} Monthly Credits
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
                    boxShadow: 2,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Additional Info */}
        {billingCycle !== 'monthly' && (
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ 
              mt: 2,
              px: { xs: 2, sm: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            * Billed {billingCycle === 'quarterly' ? 'quarterly' : billingCycle === 'halfYearly' ? 'semi-annually' : 'annually'}. 
            You save {getDiscount(billingCycle)}% compared to monthly billing.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Plans;











// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Chip,
//   ToggleButton,
//   ToggleButtonGroup,
//   Stack,
//   Paper,
//   useTheme,
//   Grid,
//   Fade,
// } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import StarIcon from '@mui/icons-material/Star';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// const Plans = ({ darkMode }) => {
//   const theme = useTheme();
//   const [billingCycle, setBillingCycle] = useState('monthly');
//   const [selectedPlan, setSelectedPlan] = useState('pro');

//   const handleBillingChange = (event, newBilling) => {
//     if (newBilling !== null) {
//       setBillingCycle(newBilling);
//     }
//   };

//   const plans = [
//     {
//       id: 'basic',
//       name: 'Basic',
//       description: 'Perfect for getting started',
//       color: darkMode ? '#6B7280' : '#4B5563',
//       gradient: darkMode 
//         ? 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
//         : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
//       credits: {
//         monthly: 10000,
//         quarterly: 30000,
//         halfYearly: 60000,
//         yearly: 120000,
//       },
//       price: {
//         monthly: 29.99,
//         quarterly: 79.99,
//         halfYearly: 149.99,
//         yearly: 289.99,
//       },
//       features: [
//         '10,000 Monthly Credits',
//         'Basic AI Models Access',
//         'Standard Support Response',
//         'Community Forum Access',
//         'Basic Analytics',
//       ],
//       cta: 'Get Started',
//     },
//     {
//       id: 'advanced',
//       name: 'Advanced',
//       description: 'For growing businesses',
//       color: darkMode ? '#3B82F6' : '#1D4ED8',
//       gradient: darkMode 
//         ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
//         : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
//       credits: {
//         monthly: 15000,
//         quarterly: 45000,
//         halfYearly: 90000,
//         yearly: 180000,
//       },
//       price: {
//         monthly: 39.99,
//         quarterly: 109.99,
//         halfYearly: 209.99,
//         yearly: 399.99,
//       },
//       features: [
//         '15,000 Monthly Credits',
//         'Advanced AI Models',
//         'Priority Support (24h)',
//         'Custom Integrations',
//         'Advanced Analytics',
//         'API Access Basic',
//       ],
//       cta: 'Start Advanced',
//     },
//     {
//       id: 'pro',
//       name: 'Professional',
//       description: 'Most popular for professionals',
//       color: darkMode ? '#F59E0B' : '#D97706',
//       gradient: darkMode 
//         ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
//         : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
//       popular: true,
//       credits: {
//         monthly: 25000,
//         quarterly: 75000,
//         halfYearly: 150000,
//         yearly: 300000,
//       },
//       price: {
//         monthly: 48.99,
//         quarterly: 139.99,
//         halfYearly: 269.99,
//         yearly: 499.99,
//       },
//       originalPrice: {
//         monthly: 69.99,
//         quarterly: 199.99,
//         halfYearly: 389.99,
//         yearly: 749.99,
//       },
//       features: [
//         '25,000 Monthly Credits',
//         'All Advanced Features',
//         'Super Feature: Business Name of IP Address',
//         'Advanced Analytics Dashboard',
//         'Priority API Access',
//         'Dedicated Support Manager',
//         'Custom Model Training',
//       ],
//       cta: 'Go Professional',
//     },
//     {
//       id: 'proPlus',
//       name: 'Enterprise',
//       description: 'For large organizations',
//       color: darkMode ? '#8B5CF6' : '#7C3AED',
//       gradient: darkMode 
//         ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
//         : 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
//       credits: {
//         monthly: 40000,
//         quarterly: 120000,
//         halfYearly: 240000,
//         yearly: 480000,
//       },
//       price: {
//         monthly: 79.99,
//         quarterly: 219.99,
//         halfYearly: 419.99,
//         yearly: 799.99,
//       },
//       features: [
//         '40,000 Monthly Credits',
//         'All Professional Features',
//         'Unlimited AI Conversations',
//         'Enterprise-grade Security',
//         'Custom SLA Agreement',
//         'White-label Solutions',
//         'On-premise Deployment',
//         '24/7 Phone Support',
//       ],
//       cta: 'Contact Sales',
//     },
//   ];

//   const getDiscount = (cycle) => {
//     const discounts = {
//       quarterly: 10,
//       halfYearly: 20,
//       yearly: 30,
//     };
//     return discounts[cycle] || 0;
//   };

//   const currentPlan = plans.find(p => p.id === selectedPlan);

//   return (
//     <Box sx={{ 
//       bgcolor: 'background.default', 
//       minHeight: '100vh',
//       background: darkMode 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)'
//         : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #F8FAFC 100%)',
//       py: { xs: 3, md: 6 },
//       px: { xs: 1, sm: 2 }
//     }}>
//       <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
//         {/* Header Section */}
//         <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
//           <Typography
//             variant="h3"
//             sx={{
//               fontWeight: 800,
//               fontSize: { xs: '2rem', md: '3rem' },
//               background: darkMode
//                 ? 'linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)'
//                 : 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)',
//               backgroundClip: 'text',
//               WebkitBackgroundClip: 'text',
//               color: 'transparent',
//               mb: 2,
//             }}
//           >
//             Choose Your Plan
//           </Typography>
//           <Typography
//             variant="h6"
//             color="text.secondary"
//             sx={{
//               fontSize: { xs: '1rem', md: '1.25rem' },
//               maxWidth: '600px',
//               mx: 'auto',
//               lineHeight: 1.6,
//             }}
//           >
//             Scale your AI capabilities with our flexible pricing plans. 
//             Start small and upgrade as you grow.
//           </Typography>
//         </Box>

//         {/* Billing Cycle Toggle */}
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           mb: { xs: 4, md: 6 },
//           position: 'relative'
//         }}>
//           <Paper
//             elevation={2}
//             sx={{
//               p: 1,
//               bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
//               borderRadius: 3,
//               backdropFilter: 'blur(10px)',
//               border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
//             }}
//           >
//             <ToggleButtonGroup
//               value={billingCycle}
//               exclusive
//               onChange={handleBillingChange}
//               sx={{
//                 '& .MuiToggleButton-root': {
//                   px: { xs: 2, md: 3 },
//                   py: 1.5,
//                   border: 'none',
//                   textTransform: 'none',
//                   fontSize: { xs: '0.75rem', md: '0.875rem' },
//                   fontWeight: 500,
//                   borderRadius: 2,
//                   color: 'text.secondary',
//                   transition: 'all 0.3s ease',
//                   '&.Mui-selected': {
//                     bgcolor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
//                     color: darkMode ? '#3B82F6' : '#1D4ED8',
//                     border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
//                   },
//                   '&:hover': {
//                     bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
//                   },
//                 },
//               }}
//             >
//               <ToggleButton value="monthly">
//                 <Box sx={{ textAlign: 'center' }}>
//                   <div>Monthly</div>
//                 </Box>
//               </ToggleButton>
//               <ToggleButton value="quarterly">
//                 <Box sx={{ textAlign: 'center' }}>
//                   <div>Quarterly</div>
//                   <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
//                     Save {getDiscount('quarterly')}%
//                   </Typography>
//                 </Box>
//               </ToggleButton>
//               <ToggleButton value="halfYearly">
//                 <Box sx={{ textAlign: 'center' }}>
//                   <div>Half Yearly</div>
//                   <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
//                     Save {getDiscount('halfYearly')}%
//                   </Typography>
//                 </Box>
//               </ToggleButton>
//               <ToggleButton value="yearly">
//                 <Box sx={{ textAlign: 'center' }}>
//                   <div>Yearly</div>
//                   <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
//                     Save {getDiscount('yearly')}%
//                   </Typography>
//                 </Box>
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </Paper>
//         </Box>

//         {/* Plan Cards Grid */}
//         <Grid container spacing={3} justifyContent="center">
//           {plans.map((plan) => (
//             <Grid item xs={12} sm={6} lg={3} key={plan.id}>
//               <Fade in timeout={800}>
//                 <Card
//                   sx={{
//                     height: '100%',
//                     position: 'relative',
//                     bgcolor: 'background.paper',
//                     border: selectedPlan === plan.id 
//                       ? `2px solid ${plan.color}`
//                       : darkMode 
//                         ? '1px solid rgba(255,255,255,0.1)'
//                         : '1px solid rgba(0,0,0,0.05)',
//                     borderRadius: 3,
//                     overflow: 'visible',
//                     transition: 'all 0.3s ease',
//                     transform: selectedPlan === plan.id ? 'translateY(-8px)' : 'none',
//                     boxShadow: selectedPlan === plan.id 
//                       ? `0 20px 40px ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
//                       : '0 4px 20px rgba(0,0,0,0.05)',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: `0 16px 32px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
//                     },
//                   }}
//                 >
//                   {plan.popular && (
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         top: -12,
//                         left: '50%',
//                         transform: 'translateX(-50%)',
//                         zIndex: 2,
//                       }}
//                     >
//                       <Chip
//                         icon={<StarIcon sx={{ fontSize: 16 }} />}
//                         label="Most Popular"
//                         sx={{
//                           bgcolor: plan.gradient,
//                           color: 'white',
//                           fontWeight: 700,
//                           fontSize: '0.75rem',
//                           px: 2,
//                           py: 1,
//                           boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//                         }}
//                       />
//                     </Box>
//                   )}

//                   <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
//                     {/* Plan Header */}
//                     <Box sx={{ textAlign: 'center', mb: 3 }}>
//                       <Box
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           borderRadius: '50%',
//                           background: plan.gradient,
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           mx: 'auto',
//                           mb: 2,
//                           boxShadow: `0 8px 20px ${plan.color}40`,
//                         }}
//                       >
//                         <TrendingUpIcon sx={{ color: 'white', fontSize: 28 }} />
//                       </Box>
//                       <Typography
//                         variant="h5"
//                         sx={{
//                           fontWeight: 700,
//                           color: 'text.primary',
//                           mb: 0.5,
//                         }}
//                       >
//                         {plan.name}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 2 }}
//                       >
//                         {plan.description}
//                       </Typography>
//                     </Box>

//                     {/* Pricing */}
//                     <Box sx={{ textAlign: 'center', mb: 3 }}>
//                       {plan.originalPrice?.[billingCycle] && (
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             textDecoration: 'line-through',
//                             color: 'text.disabled',
//                             mb: 0.5,
//                           }}
//                         >
//                           ${plan.originalPrice[billingCycle].toFixed(2)}
//                         </Typography>
//                       )}
//                       <Typography
//                         variant="h3"
//                         sx={{
//                           fontWeight: 800,
//                           background: plan.gradient,
//                           backgroundClip: 'text',
//                           WebkitBackgroundClip: 'text',
//                           color: 'transparent',
//                           lineHeight: 1,
//                           mb: 0.5,
//                         }}
//                       >
//                         ${plan.price[billingCycle].toFixed(2)}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ fontWeight: 500 }}
//                       >
//                         per month
//                       </Typography>
//                     </Box>

//                     {/* Credits */}
//                     <Box
//                       sx={{
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
//                         borderRadius: 2,
//                         p: 2,
//                         mb: 3,
//                         textAlign: 'center',
//                       }}
//                     >
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 700,
//                           color: plan.color,
//                           mb: 0.5,
//                         }}
//                       >
//                         {plan.credits[billingCycle].toLocaleString()} Credits
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                       >
//                         {billingCycle === 'monthly' ? 'Monthly' : 
//                          billingCycle === 'quarterly' ? 'Every 3 months' :
//                          billingCycle === 'halfYearly' ? 'Every 6 months' : 'Annual'}
//                       </Typography>
//                     </Box>

//                     {/* Features */}
//                     <Stack spacing={1.5} sx={{ mb: 3, flexGrow: 1 }}>
//                       {plan.features.map((feature, index) => (
//                         <Box
//                           key={index}
//                           sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
//                         >
//                           <CheckCircleIcon
//                             sx={{
//                               color: plan.color,
//                               fontSize: 20,
//                               flexShrink: 0,
//                               mt: 0.1,
//                             }}
//                           />
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               color: 'text.primary',
//                               lineHeight: 1.4,
//                             }}
//                           >
//                             {feature}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </Stack>

//                     {/* CTA Button */}
//                     <Button
//                       fullWidth
//                       variant={selectedPlan === plan.id ? "contained" : "outlined"}
//                       size="large"
//                       onClick={() => setSelectedPlan(plan.id)}
//                       sx={{
//                         bgcolor: selectedPlan === plan.id ? plan.gradient : 'transparent',
//                         color: selectedPlan === plan.id ? 'white' : plan.color,
//                         border: selectedPlan === plan.id ? 'none' : `2px solid ${plan.color}`,
//                         py: 1.5,
//                         borderRadius: 2,
//                         textTransform: 'none',
//                         fontSize: '1rem',
//                         fontWeight: 600,
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           bgcolor: selectedPlan === plan.id ? plan.color : `${plan.color}10`,
//                           transform: 'translateY(-2px)',
//                           boxShadow: `0 8px 20px ${plan.color}40`,
//                         },
//                       }}
//                     >
//                       {plan.cta}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Fade>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Additional Info */}
//         <Box sx={{ textAlign: 'center', mt: 4 }}>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{
//               fontSize: { xs: '0.75rem', sm: '0.875rem' },
//               maxWidth: '500px',
//               mx: 'auto',
//             }}
//           >
//             All plans include a 14-day free trial. No credit card required. 
//             Upgrade, downgrade, or cancel anytime.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Plans;