import React from 'react';
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
  Chip
} from '@mui/material';
import {
  School,
  Analytics,
  Assessment,
  People,
  Notifications,
  Settings,
  Logout,
  TrendingUp,
  CheckCircle,
  Groups,
  Assignment
} from '@mui/icons-material';

const HODDashboard = ({ onLogout }) => {
  // Mock data for demonstration
  const hodData = {
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    totalStudents: 180,
    approvedStudents: 145,
    pendingApproval: 35,
    placementRate: 78,
    recentActivities: [
      { type: "approval", message: "Approved 5 new student registrations", time: "1 hour ago" },
      { type: "report", message: "Generated department placement report", time: "2 hours ago" },
      { type: "meeting", message: "Placement committee meeting scheduled", time: "1 day ago" }
    ]
  };

  const quickActions = [
    {
      title: "Student Management",
      description: "Approve and manage student registrations",
      icon: <People sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      action: () => console.log('Student Management clicked')
    },
    {
      title: "Analytics",
      description: "View department placement statistics",
      icon: <Analytics sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
      action: () => console.log('Analytics clicked')
    },
    {
      title: "Reports",
      description: "Generate placement reports",
      icon: <Assessment sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      action: () => console.log('Reports clicked')
    },
    {
      title: "Student Profiles",
      description: "View and edit student profiles",
      icon: <School sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      action: () => console.log('Student Profiles clicked')
    }
  ];

  return (
    <div className="glass-card" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
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
                {hodData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Welcome, {hodData.name.split(' ')[1]}!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {hodData.department} Department
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'white' }}>
                <Notifications />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
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
                  <People sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {hodData.totalStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
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
                  <CheckCircle sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  {hodData.approvedStudents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved Students
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(hodData.approvedStudents / hodData.totalStudents) * 100} 
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
                  {hodData.pendingApproval}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approval
                </Typography>
                <Chip 
                  label="Needs attention" 
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
                  background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'pulse 2s infinite'
                }}>
                  <TrendingUp sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  {hodData.placementRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placement Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={hodData.placementRate} 
                  color="secondary"
                  sx={{ mt: 1, borderRadius: 5 }}
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
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                {hodData.recentActivities.map((activity, index) => (
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
                      bgcolor: 'secondary.main',
                      mr: 2,
                      animation: index === 0 ? 'pulse 2s infinite' : 'none'
                    }}>
                      {activity.type === 'approval' && <CheckCircle />}
                      {activity.type === 'report' && <Assessment />}
                      {activity.type === 'meeting' && <Groups />}
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
                      color="secondary" 
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
                  Quick Stats
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    📈 Department Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your department is performing above average in placements.
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    ⏰ Pending Tasks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    5 students pending approval, 2 reports to review.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    🎯 Goals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target 80% placement rate by year-end.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HODDashboard;