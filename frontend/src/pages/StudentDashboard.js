import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Badge
} from '@mui/material';
import {
  School,
  Assignment,
  TrendingUp,
  Description,
  ShowChart,
  Notifications,
  Settings,
  Logout,
  AccountCircle
} from '@mui/icons-material';
import NotificationPanel from '../components/NotificationPanel';
import Logo from '../components/Logo';
import EnhancedQuickActionCard from '../components/EnhancedQuickActionCard';
import BackButton from '../components/BackButton';

const StudentDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const notificationOpen = Boolean(notificationAnchor);
  
  const studentData = {
    name: "John Doe",
    cgpa: 8.5,
    totalApplications: 12,
    pendingApplications: 3,
    profileCompletion: 85,
    recentActivity: [
      { type: "application", message: "Applied to Google - Software Engineer", time: "2 hours ago" },
      { type: "interview", message: "Interview scheduled with Microsoft", time: "1 day ago" },
      { type: "result", message: "Passed technical round at Amazon", time: "3 days ago" }
    ]
  };

  const quickActions = [
    {
      title: "Profile",
      description: "Manage your profile information and resume with AI insights",
      icon: <AccountCircle sx={{ fontSize: 40, color: '#667eea' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/student/profile')
    },
    {
      title: "Placement Drives",
      description: "View and apply to drives with AI job fit scores",
      icon: <School sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      action: () => navigate('/student/drives')
    },
    {
      title: "Applications",
      description: "Track applications with AI progress predictions",
      icon: <Assignment sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      action: () => navigate('/student/applications')
    },
    {
      title: "Analytics",
      description: "AI-powered placement statistics and insights",
      icon: <TrendingUp sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      action: () => navigate('/student/analytics')
    },
    {
      title: "Resume",
      description: "AI-enhanced resume optimization and scoring",
      icon: <Description sx={{ fontSize: 40, color: '#f44336' }} />,
      color: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
      action: () => navigate('/student/resume')
    },
    {
      title: "Results",
      description: "View round results with AI feedback analysis",
      icon: <ShowChart sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
      action: () => navigate('/student/results')
    }
  ];

  return (
    <div className="glass-card" style={{ minHeight: '100vh', position: 'relative' }}>
      <BackButton />
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Logo size="small" color="white" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '24px',
                  animation: 'pulse 2s infinite'
                }}>
                  {studentData.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Welcome back, {studentData.name.split(' ')[0]}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Ready to conquer your next opportunity?
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ color: 'white' }}
                onClick={(event) => setNotificationAnchor(event.currentTarget)}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => navigate('/student/settings')}
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
        {/* Stats Cards */}
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
                  <TrendingUp sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {studentData.cgpa}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current CGPA
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={studentData.cgpa * 10} 
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
                  <Assignment sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  {studentData.totalApplications}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Applications
                </Typography>
                <Chip 
                  label={`${studentData.pendingApplications} pending`} 
                  size="small" 
                  color="warning" 
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
                  <Description sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {studentData.profileCompletion}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profile Complete
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={studentData.profileCompletion} 
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
                  <ShowChart sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interviews Scheduled
                </Typography>
                <Chip 
                  label="2 this week" 
                  size="small" 
                  color="success" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions Grid */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          Quick Actions
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
                  overflow: 'hidden'
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
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Recent Activity
                </Typography>
                {studentData.recentActivity.map((activity, index) => (
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
                      {activity.type === 'application' && <Assignment />}
                      {activity.type === 'interview' && <School />}
                      {activity.type === 'result' && <ShowChart />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {activity.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip 
                      label={activity.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Tips & Resources
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep your resume updated with your latest projects and achievements.
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    📚 Study Material
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check out our latest placement preparation resources.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    🎯 Goal Setting
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set clear placement goals to track your progress.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Notification Panel */}
      <NotificationPanel
        userRole="student"
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
        open={notificationOpen}
      />
    </div>
  );
};

export default StudentDashboard;