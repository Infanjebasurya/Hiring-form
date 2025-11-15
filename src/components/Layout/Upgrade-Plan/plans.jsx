import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  Tabs,
  Tab,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Plans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [country, setCountry] = useState('India');

  const pricing = {
    monthly: {
      original: 6999,
      discounted: 4899,
      credits: 25000,
    },
    quarterly: {
      original: 18999,
      discounted: 13299,
      credits: 75000,
    },
    halfYearly: {
      original: 35999,
      discounted: 25199,
      credits: 150000,
    },
    yearly: {
      original: 58788,
      discounted: 41152,
      credits: 300000,
    },
  };

  const currentPrice = pricing[billingCycle];

  const billingOptions = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'halfYearly', label: 'Half Yearly' },
    { id: 'yearly', label: 'Yearly · Save 30%' },
  ];

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBillingChange = (event, newValue) => {
    setBillingCycle(newValue);
  };

  return (
    <Box sx={{
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      py: isMobile ? 2 : 3 // Reduced padding
    }}>
      <Container maxWidth="lg">
        {/* Billing Cycle Navigation Tabs */}
        <Box sx={{
          maxWidth: 900,
          mx: 'auto',
          mb: 2, // Reduced margin
        }}>
          <Tabs
            value={billingCycle}
            onChange={handleBillingChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              minHeight: 40, // Reduced height
              '& .MuiTab-root': {
                minHeight: 40, // Reduced height
                fontSize: '0.75rem', // Smaller font
                fontWeight: 500,
                textTransform: 'none',
                py: 0.8, // Reduced padding
                px: 1.5, // Reduced padding
                color: theme.palette.text.secondary,
                borderRadius: 2,
                margin: '0 2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none !important',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(52, 152, 219, 0.15)'
                    : 'rgba(52, 152, 219, 0.1)',
                },
                '&.Mui-selected': {
                  color: '#fff',
                  fontWeight: 700,
                  backgroundColor: '#3498DB',
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focusVisible': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-scroller': {
                padding: '2px 0', // Reduced padding
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ textAlign: 'center', fontWeight: 'inherit' }}>
                  <div style={{ fontWeight: 'inherit' }}>Monthly</div>
                </Box>
              }
              value="monthly"
            />
            <Tab
              label={
                <Box sx={{ textAlign: 'center', fontWeight: 'inherit' }}>
                  <div style={{ fontWeight: 'inherit' }}>Quarterly</div>
                </Box>
              }
              value="quarterly"
            />
            <Tab
              label={
                <Box sx={{ textAlign: 'center', fontWeight: 'inherit' }}>
                  <div style={{ fontWeight: 'inherit' }}>Half Yearly</div>
                </Box>
              }
              value="halfYearly"
            />
            <Tab
              label={
                <Box sx={{ textAlign: 'center', fontWeight: 'inherit' }}>
                  <div style={{ fontWeight: 'inherit' }}>Yearly</div>
                  <Box
                    sx={{
                      fontSize: '0.65rem', // Smaller font
                      fontWeight: 700,
                      color: billingCycle === 'yearly' ? '#fff' : '#2ECC71',
                      background: billingCycle === 'yearly'
                        ? 'rgba(255, 255, 255, 0.3)'
                        : (theme.palette.mode === 'dark'
                          ? 'rgba(46, 204, 113, 0.15)'
                          : 'rgba(46, 204, 113, 0.1)'),
                      borderRadius: 1,
                      px: 0.4, // Reduced padding
                      mt: 0.3, // Reduced margin
                      lineHeight: 1.2, // Tighter line height
                    }}
                  >
                    Save 30%
                  </Box>
                </Box>
              }
              value="yearly"
            />
          </Tabs>
        </Box>

        {/* Main Content Card */}
        <Card
          sx={{
            maxWidth: 900,
            mx: 'auto',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            p: isMobile ? 2 : 3, // Reduced padding
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }
          }}
        >
          {/* Title */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            Upgrade Plan
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              mb: 3, // Reduced margin
              opacity: 0.8,
            }}
          >
            Current Plan: Basic
          </Typography>

          <Grid container spacing={3}> {/* Reduced spacing */}
            {/* Left Column - Pricing */}
            <Grid item xs={12} md={7}>
              {/* Pricing Display */}
              <Box sx={{ mb: 2 }}> {/* Reduced margin */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1, flexWrap: 'wrap' }}> {/* Reduced margins */}
                  <Typography
                    sx={{
                      fontSize: isMobile ? '0.9rem' : '1.1rem', // Smaller font
                      textDecoration: 'line-through',
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      opacity: 0.7,
                    }}
                  >
                    {formatINR(currentPrice.original)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '1.75rem' : '2.5rem', // Smaller font
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      lineHeight: 1,
                    }}
                  >
                    {formatINR(currentPrice.discounted)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMobile ? '0.8rem' : '0.9rem', // Smaller font
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      opacity: 0.8,
                    }}
                  >
                    {billingCycle === 'monthly' ? 'Monthly' :
                      billingCycle === 'quarterly' ? 'Quarterly' :
                        billingCycle === 'halfYearly' ? 'Half Yearly' : 'Yearly'}
                    <sup style={{ fontSize: '0.6rem' }}>1</sup>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Features */}
            <Grid item xs={12} md={5}>
              <Box sx={{ pl: { md: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 2, // Reduced margin
                  }}
                >
                  <CheckCircleIcon sx={{
                    color: '#2ECC71',
                    fontSize: isMobile ? 16 : 18, // Smaller icons
                    mt: 0.2
                  }} />
                  <Typography sx={{
                    fontSize: isMobile ? '0.8rem' : '0.85rem', // Smaller font
                    color: theme.palette.text.primary,
                    lineHeight: 1.4 // Tighter line height
                  }}>
                    <strong>{currentPrice.credits.toLocaleString()}</strong> Monthly Credits
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 2, // Reduced margin
                  }}
                >
                  <CheckCircleIcon sx={{
                    color: '#2ECC71',
                    fontSize: isMobile ? 16 : 18, // Smaller icons
                    mt: 0.2
                  }} />
                  <Typography sx={{
                    fontSize: isMobile ? '0.8rem' : '0.85rem', // Smaller font
                    color: theme.palette.text.primary,
                    lineHeight: 1.4 // Tighter line height
                  }}>
                    <strong>All Default Features</strong> Included
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon sx={{
                    color: '#2ECC71',
                    fontSize: isMobile ? 16 : 18, // Smaller icons
                    mt: 0.2
                  }} />
                  <Typography sx={{
                    fontSize: isMobile ? '0.8rem' : '0.85rem', // Smaller font
                    color: theme.palette.text.primary,
                    lineHeight: 1.4 // Tighter line height
                  }}>
                    <strong>Super Feature:</strong> Business Name of IP Address
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Upgrade Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#3498DB',
              color: 'white',
              py: 1.2, // Reduced padding
              textTransform: 'none',
              fontSize: isMobile ? '0.85rem' : '0.9rem', // Smaller font
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 'none',
              mt: 2, // Reduced margin
              border: '2px solid transparent',
              '&:hover': {
                bgcolor: '#2980B9',
                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
              },
              '&:focus': {
                border: '2px solid #FFD700',
                bgcolor: '#3498DB',
              },
            }}
          >
            Upgrade Plan - {formatINR(currentPrice.discounted)}
          </Button>

          {/* Form Section */}
          <Box sx={{ mt: 3 }}> {/* Reduced margin */}
            <Grid container spacing={1.5}> {/* Reduced spacing */}
              {/* Email & Country */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.8, // Reduced margin
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '0.8rem', // Smaller font
                  }}
                >
                  Email Address <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.2,
                      bgcolor: theme.palette.background.default,
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498DB',
                        borderWidth: 2,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                      py: 0.8, // Reduced padding
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}> {/* Reduced margin */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: '0.8rem', // Smaller font
                    }}
                  >
                    Country <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <IconButton size="small" sx={{ p: 0 }}>
                    <HelpOutlineIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} /> {/* Smaller icon */}
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.2,
                      bgcolor: theme.palette.background.default,
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498DB',
                        borderWidth: 2,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                      py: 0.8, // Reduced padding
                      fontSize: '0.875rem',
                    },
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.secondary,
                    },
                  }}
                >
                  <MenuItem value="Romania">🇷🇴 Romania</MenuItem>
                  <MenuItem value="USA">🇺🇸 USA</MenuItem>
                  <MenuItem value="India">🇮🇳 India</MenuItem>
                </TextField>
              </Grid>

              {/* Voucher Code */}
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.8, // Reduced margin
                    color: theme.palette.text.secondary,
                    fontSize: '0.8rem', // Smaller font
                  }}
                >
                  Voucher Code · Optional
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter voucher code"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.2,
                      bgcolor: theme.palette.background.default,
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3498DB',
                        borderWidth: 2,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                      py: 0.8, // Reduced padding
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Grid>

              {/* Optional Invoice Contents Accordion */}
              <Grid item xs={12}>
                <Accordion
                  sx={{
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1.2,
                    '&:before': { display: 'none' },
                    bgcolor: theme.palette.background.paper,
                    '&.Mui-expanded': {
                      margin: 0,
                    },
                    '&.MuiAccordion-root.Mui-expanded': {
                      border: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />}
                    sx={{
                      minHeight: 44, // Reduced height
                      '& .MuiAccordionSummary-content': {
                        my: 0.8, // Reduced margin
                      },
                      '&.Mui-focused': {
                        outline: 'none',
                        bgcolor: 'transparent',
                      },
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      },
                      '&.Mui-expanded': {
                        minHeight: 44, // Reduced height
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReceiptIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} /> {/* Smaller icon */}
                      <Typography sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '0.85rem' // Smaller font
                      }}>
                        Optional Invoice Contents
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ ml: 'auto', mr: 0.5, p: 0.3 }}>
                      <HelpOutlineIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} /> {/* Smaller icon */}
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 1.5 }}> {/* Reduced padding */}
                    <Grid container spacing={1.5}> {/* Reduced spacing */}
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.8, // Reduced margin
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem', // Smaller font
                            fontWeight: 500,
                          }}
                        >
                          Business Name · Optional
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.default,
                              borderRadius: 1,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 0.6, // Reduced padding
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.8, // Reduced margin
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem', // Smaller font
                            fontWeight: 500,
                          }}
                        >
                          Address · Optional
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.default,
                              borderRadius: 1,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 0.6, // Reduced padding
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.8, // Reduced margin
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem', // Smaller font
                            fontWeight: 500,
                          }}
                        >
                          VAT Number · Optional
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.default,
                              borderRadius: 1,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 0.6, // Reduced padding
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.8, // Reduced margin
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem', // Smaller font
                            fontWeight: 500,
                          }}
                        >
                          First Name · Optional
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.default,
                              borderRadius: 1,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 0.6, // Reduced padding
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.8, // Reduced margin
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem', // Smaller font
                            fontWeight: 500,
                          }}
                        >
                          Last Name · Optional
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: theme.palette.background.default,
                              borderRadius: 1,
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3498DB',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.text.primary,
                              py: 0.6, // Reduced padding
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Plans;