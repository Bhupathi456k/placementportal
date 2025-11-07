import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  School,
  Business,
  AdminPanelSettings,
  Login as LoginIcon
} from '@mui/icons-material';
import { login } from '../services/authService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginPage = ({ onLogin }) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const roleInfo = [
    {
      role: 'student',
      label: 'Student',
      description: 'Apply for placement drives and track applications',
      icon: <School sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      demoCredentials: { email: 'student@demo.com', password: 'password123' }
    },
    {
      role: 'hod',
      label: 'HOD',
      description: 'Manage students in your department',
      icon: <Business sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      demoCredentials: { email: 'hod@demo.com', password: 'password123' }
    },
    {
      role: 'tpo',
      label: 'TPO',
      description: 'Full system administration and placement management',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      demoCredentials: { email: 'tpo@demo.com', password: 'password123' }
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    const role = roleInfo[newValue].role;
    setFormData({ 
      ...formData, 
      role,
      email: roleInfo[newValue].demoCredentials.email,
      password: roleInfo[newValue].demoCredentials.password
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await login(formData.email, formData.password);
      onLogin(token, user.role);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoData = roleInfo[tabValue].demoCredentials;
    setFormData({
      ...formData,
      email: demoData.email,
      password: demoData.password
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            animation: 'fadeIn 1s ease-out'
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '32px',
              mx: 'auto',
              mb: 2,
              animation: 'pulse 2s infinite'
            }}>
              🎓
            </Avatar>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Placement Portal
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300
              }}
            >
              Your Gateway to Career Success
            </Typography>
          </Box>

          <Paper 
            elevation={10} 
            sx={{ 
              p: 4, 
              width: '100%',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              animation: 'scaleIn 0.5s ease-out',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative header bar */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease-in-out infinite'
            }} />

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  animation: 'slideIn 0.5s ease-out'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Role selection tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    borderRadius: '12px 12px 0 0',
                    minHeight: 60,
                    fontSize: '14px',
                    fontWeight: 600
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white !important'
                  }
                }}
              >
                {roleInfo.map((role, index) => (
                  <Tab 
                    key={index}
                    icon={role.icon} 
                    label={role.label}
                    iconPosition="start"
                    sx={{ 
                      flexDirection: 'row',
                      gap: 1
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={tabValue}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  animation: 'pulse 2s infinite'
                }}>
                  {roleInfo[tabValue].icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {roleInfo[tabValue].label} Login
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {roleInfo[tabValue].description}
                </Typography>
              </Box>
            </TabPanel>

            {/* Login form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 3,
                    '&:focus-within': {
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 3,
                    '&:focus-within': {
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />

              {/* Demo login button */}
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={handleDemoLogin}
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  borderRadius: 3,
                  py: 1.5,
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    borderColor: 'primary.main'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🎯 Use Demo Credentials
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ 
                  mt: 1, 
                  mb: 3,
                  borderRadius: 3,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Demo credentials info */}
              <Box sx={{ 
                textAlign: 'center', 
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(102, 126, 234, 0.1)'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  📋 Demo Credentials for Testing:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${roleInfo[tabValue].label}: ${roleInfo[tabValue].demoCredentials.email}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Chip 
                    label={`Password: ${roleInfo[tabValue].demoCredentials.password}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              textAlign: 'center', 
              mt: 3,
              fontSize: '14px'
            }}
          >
            🚀 Powered by Modern Technology • Secure & Reliable
          </Typography>
        </Box>
      </Container>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;