import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Business,
  School,
  Assignment,
  TrendingUp,
  Settings,
  Analytics,
  Notifications,
  Logout,
  GroupAdd,
  EventNote,
  Assessment,
  Security,
  Timeline,
  CheckCircle,
  Refresh,
  ArrowBack
} from '@mui/icons-material';
import NotificationPanel from '../components/NotificationPanel';
import Logo from '../components/Logo';
import CompanyManagement from '../components/tpo/CompanyManagement';
import PlacementDrives from '../components/tpo/PlacementDrives';
import StudentApplications from '../components/tpo/StudentApplications';
import RecruitmentRounds from '../components/tpo/RecruitmentRounds';
import Reports from '../components/tpo/Reports';
import SystemAdmin from '../components/tpo/SystemAdmin';
import { tpoService } from '../services/tpoService';
import BackButton from '../components/BackButton';

const TPODashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock user data
  const tpoData = {
    name: "Mr. Robert Anderson",
    email: "robert.anderson@college.edu",
    role: "Training & Placement Officer"
  };

  // Quick actions with new AI-powered interfaces
  const quickActions = [
    {
      title: "Company Management",
      description: "Add and manage company details with AI insights",
      icon: <Business sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      action: () => setActiveView('company-management'),
      aiPowered: true
    },
    {
      title: "Placement Drives",
      description: "Create and manage placement drives with AI analytics",
      icon: <School sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
      action: () => setActiveView('placement-drives'),
      aiPowered: true
    },
    {
      title: "Student Applications",
      description: "Review and filter student applications with AI insights",
      icon: <Assignment sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      action: () => setActiveView('student-applications'),
      aiPowered: true
    },
    {
      title: "Recruitment Rounds",
      description: "Manage recruitment process with AI optimization",
      icon: <Timeline sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      action: () => setActiveView('recruitment-rounds'),
      aiPowered: true
    },
    {
      title: "Reports",
      description: "Generate comprehensive AI-powered reports",
      icon: <Analytics sx={{ fontSize: 40, color: '#f44336' }} />,
      color: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
      action: () => setActiveView('reports'),
      aiPowered: true
    },
    {
      title: "System Admin",
      description: "System configuration and AI optimization",
      icon: <Security sx={{ fontSize: 40, color: '#607d8b' }} />,
      color: 'linear-gradient(135deg, #607d8b 0%, #78909c 100%)',
      action: () => setActiveView('system-admin'),
      aiPowered: true
    }
  ];

  useEffect(() => {
    loadLiveStats();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadLiveStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveStats = async () => {
    try {
      setError(null);
      const response = await tpoService.getLiveStats();
      setLiveStats(response.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLiveStats();
    setRefreshing(false);
  };

  // Render current view
  const renderCurrentView = () => {
    switch (activeView) {
      case 'company-management':
        return <CompanyManagement onClose={() => setActiveView('dashboard')} />;
      case 'placement-drives':
        return <PlacementDrives onClose={() => setActiveView('dashboard')} />;
      case 'student-applications':
        return <StudentApplications onClose={() => setActiveView('dashboard')} />;
      case 'recruitment-rounds':
        return <RecruitmentRounds onClose={() => setActiveView('dashboard')} />;
      case 'reports':
        return <Reports onClose={() => setActiveView('dashboard')} />;
      case 'system-admin':
        return <SystemAdmin onClose={() => setActiveView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
        color: 'white',
        p: 3,
        borderRadius: '0 0 20px 20px',
        mb: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '24px',
                animation: 'pulse 2s infinite'
              }}>
                {tpoData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Welcome, {tpoData.name.split(' ')[1]}!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {tpoData.role}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                sx={{ color: 'white' }}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <Refresh />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <Notifications />
              </IconButton>
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => navigate('/tpo/settings')}
              >
                <Settings />
              </IconButton>
              <Button 
                variant="outlined" 
                startIcon={<Logout />}
                onClick={onLogout}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Live Stats Cards */}
        {liveStats ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="animated-card">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    animation: 'pulse 2s infinite'
                  }}>
                    <Business sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {liveStats.totalCompanies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Companies
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={90} 
                    sx={{ mt: 1, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="animated-card">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #2196f3, #64b5f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    animation: 'pulse 2s infinite'
                  }}>
                    <School sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    {liveStats.activeDrives}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Drives
                  </Typography>
                  <Chip 
                    label="2 this week" 
                    size="small" 
                    color="info" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="animated-card">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    animation: 'pulse 2s infinite'
                  }}>
                    <Assignment sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {liveStats.totalApplications}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    color="warning"
                    sx={{ mt: 1, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="animated-card">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    animation: 'pulse 2s infinite'
                  }}>
                    <CheckCircle sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    {liveStats.successfulPlacements}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful Placements
                  </Typography>
                  <Chip 
                    label="25% success rate" 
                    size="small" 
                    color="secondary" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading Live Data...</Typography>
          </Box>
        )}

        {/* AI-Powered Quick Actions Grid */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          AI-Powered Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                className="animated-card animated-button"
                onClick={action.action}
                sx={{ 
                  cursor: 'pointer',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: action.color,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: 4,
                  background: 'rgba(255,255,255,0.3)',
                  animation: 'pulse 3s infinite'
                }} />
                <Box sx={{ p: 3 }}>
                  {action.icon}
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {action.description}
                  </Typography>
                  {action.aiPowered && (
                    <Chip
                      label="AI-Powered"
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* System Overview and Upcoming Events */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  AI-Powered System Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, background: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        📊 Performance Metrics
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><TrendingUp color="success" /></ListItemIcon>
                          <ListItemText primary="Placement rate improved by 12%" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><GroupAdd color="info" /></ListItemIcon>
                          <ListItemText primary="15 new companies registered" />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, background: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      <Typography variant="h6" color="secondary" gutterBottom>
                        ⚡ AI Quick Stats
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><EventNote color="warning" /></ListItemIcon>
                          <ListItemText primary="3 drives scheduled this week" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Assessment color="error" /></ListItemIcon>
                          <ListItemText primary="95% system uptime" />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Upcoming Events
                </Typography>
                {[
                  { type: 'interview', company: 'Google', date: 'Nov 15, 2025' },
                  { type: 'drive', company: 'Microsoft', date: 'Nov 18, 2025' },
                  { type: 'campus', company: 'Amazon', date: 'Nov 22, 2025' }
                ].map((event, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0,0,0,0.02)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.05)',
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: 'primary.main',
                      mr: 2,
                      animation: index === 0 ? 'pulse 2s infinite' : 'none'
                    }}>
                      {event.type === 'interview' && <Timeline />}
                      {event.type === 'drive' && <School />}
                      {event.type === 'campus' && <Business />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {event.company}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.date}
                      </Typography>
                    </Box>
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );

  if (loading) {
    return (
      <div className="glass-card" style={{ minHeight: '100vh' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading TPO Dashboard...</Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ minHeight: '100vh', position: 'relative' }}>
      <BackButton />
      {/* Floating Back Button */}
      {activeView !== 'dashboard' && (
        <Fab
          color="primary"
          aria-label="back"
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1000
          }}
          onClick={() => setActiveView('dashboard')}
        >
          <ArrowBack />
        </Fab>
      )}

      {renderCurrentView()}
    </div>
  );
};

export default TPODashboard;