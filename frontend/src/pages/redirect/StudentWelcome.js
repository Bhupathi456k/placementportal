import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Badge,
  Paper,
  Divider,
  Tooltip,
  Skeleton,
  Fade,
  Grow,
  Slide,
  Zoom,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School,
  Assignment,
  TrendingUp,
  Description,
  ShowChart,
  Settings,
  AccountCircle,
  ArrowForward,
  CheckCircle,
  Star,
  EmojiEvents,
  Timeline,
  MenuBook,
  VideoCall,
  LocalOffer,
  QueryStats,
  Speed,
  Refresh,
  Dashboard,
  Person,
  Work,
  Analytics,
  Launch,
  PlayArrow,
  Favorite,
  ThumbUp,
  Visibility,
  Notifications,
  Bookmark,
  Share
} from '@mui/icons-material';
import { getUserData } from '../../services/authService';
import { api } from '../../services/authService';
import BackButton from '../../components/BackButton';

const StudentWelcome = ({ onLogout }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatingCards, setAnimatingCards] = useState(new Set());

  const observerRef = useRef(null);

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    // Fetch real-time stats
    fetchStudentStats();

    // Page load animation
    const timer = setTimeout(() => setPageLoaded(true), 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            if (cardId) {
              setAnimatingCards(prev => new Set([...prev, cardId]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  const fetchStudentStats = async () => {
    try {
      const response = await api.get('/api/dashboard/student-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (action, index) => {
    setAnimatingCards(prev => new Set([...prev, `action-${index}`]));
    setTimeout(() => {
      action();
    }, 300);
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const quickActions = [
    {
      title: "View Dashboard",
      description: "Go to your main dashboard",
      icon: <School sx={{ fontSize: 40, color: '#667eea' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/student')
    },
    {
      title: "Browse Drives",
      description: "Find placement opportunities",
      icon: <Assignment sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      action: () => console.log('Browse drives')
    },
    {
      title: "Update Profile",
      description: "Complete your profile",
      icon: <AccountCircle sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      action: () => console.log('Update profile')
    },
    {
      title: "Resume Builder",
      description: "Create a professional resume",
      icon: <Description sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
      action: () => console.log('Resume builder')
    },
    {
      title: "Interview Prep",
      description: "Practice for interviews",
      icon: <VideoCall sx={{ fontSize: 40, color: '#e91e63' }} />,
      color: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
      action: () => console.log('Interview prep')
    },
    {
      title: "Career Insights",
      description: "View analytics and insights",
      icon: <QueryStats sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      action: () => console.log('Career insights')
    },
    {
      title: "Learning Hub",
      description: "Access study resources",
      icon: <MenuBook sx={{ fontSize: 40, color: '#ff5722' }} />,
      color: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
      action: () => console.log('Learning hub')
    },
    {
      title: "Achievements",
      description: "View your milestones",
      icon: <EmojiEvents sx={{ fontSize: 40, color: '#ffc107' }} />,
      color: 'linear-gradient(135deg, #ffc107 0%, #ffeb3b 100%)',
      action: () => console.log('Achievements')
    }
  ];

  const studentTips = [
    "Keep your profile updated with latest achievements",
    "Apply to drives that match your skill set",
    "Prepare for interviews using our resources",
    "Track your application status regularly"
  ];

  const recentActivities = [
    { activity: "Applied to Google SWE Drive", time: "2 hours ago", status: "pending" },
    { activity: "Updated resume with new project", time: "1 day ago", status: "completed" },
    { activity: "Completed interview practice", time: "2 days ago", status: "completed" },
    { activity: "Attended coding workshop", time: "3 days ago", status: "completed" }
  ];

  if (!userData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <CircularProgress size={60} sx={{ mb: 2, color: 'white' }} />
            <Typography variant="h6">Loading your dashboard...</Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }
      }}
    >
      <BackButton />
      {/* Header */}
      <Slide direction="down" in={pageLoaded} timeout={800}>
        <Box sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          p: { xs: 2, md: 3 },
          borderRadius: '0 0 30px 30px',
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'rotate 15s linear infinite'
          }
        }}>
          <Container maxWidth="lg">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              position: 'relative',
              zIndex: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                <Zoom in={pageLoaded} timeout={1000}>
                  <Avatar sx={{
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: { xs: '24px', md: '32px' },
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}>
                    🎓
                  </Avatar>
                </Zoom>
                <Fade in={pageLoaded} timeout={1200}>
                  <Box>
                    <Typography
                      variant={isSmallScreen ? "h4" : "h3"}
                      sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Welcome, {userData.first_name || 'Student'}!
                    </Typography>
                    <Typography
                      variant={isSmallScreen ? "h6" : "h5"}
                      sx={{
                        opacity: 0.9,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      Your placement journey starts here
                    </Typography>
                  </Box>
                </Fade>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Fade in={pageLoaded} timeout={1400}>
                  <Button
                    variant="outlined"
                    startIcon={<Settings />}
                    onClick={onLogout}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 3,
                      px: { xs: 2, md: 3 },
                      py: 1,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Fade>
              </Box>
            </Box>
          </Container>
        </Box>
      </Slide>

      <Container maxWidth="lg">
        {/* Welcome Alert */}
        <Grow in={pageLoaded} timeout={1000}>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 4,
              fontSize: { xs: '14px', md: '16px' },
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            icon={<Star />}
          >
            🎉 Successfully logged in! You're now ready to explore placement opportunities.
          </Alert>
        </Grow>

        {/* Stats Overview */}
        {!loading && stats ? (
          <Fade in={pageLoaded} timeout={1200}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                {
                  value: stats.stats.total_applications,
                  label: 'Total Applications',
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  icon: <Assignment sx={{ fontSize: 30, color: 'white' }} />
                },
                {
                  value: `${stats.stats.profile_completion}%`,
                  label: 'Profile Complete',
                  gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  icon: <Person sx={{ fontSize: 30, color: 'white' }} />
                },
                {
                  value: stats.stats.available_drives,
                  label: 'Available Drives',
                  gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  icon: <Work sx={{ fontSize: 30, color: 'white' }} />
                },
                {
                  value: `${stats.stats.placement_rate}%`,
                  label: 'Success Rate',
                  gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  icon: <TrendingUp sx={{ fontSize: 30, color: 'white' }} />
                }
              ].map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Grow in={pageLoaded} timeout={1200 + index * 200}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        background: stat.gradient,
                        color: 'white',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          transform: 'translateX(-100%)',
                          transition: 'transform 0.6s'
                        },
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          '&::before': {
                            transform: 'translateX(100%)'
                          }
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {stat.icon}
                        <Typography
                          variant={isSmallScreen ? "h5" : "h4"}
                          fontWeight="bold"
                          sx={{ mt: 1, mb: 0.5 }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Fade>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={120}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Quick Actions */}
        <Fade in={pageLoaded} timeout={1400}>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Quick Actions
          </Typography>
        </Fade>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Grow
                in={pageLoaded}
                timeout={1600 + index * 150}
                style={{ transformOrigin: '0 0 0' }}
              >
                <Card
                  ref={(el) => {
                    if (el && observerRef.current) {
                      observerRef.current.observe(el);
                    }
                  }}
                  data-card-id={`action-${index}`}
                  onClick={() => handleCardClick(action.action, index)}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={handleCardLeave}
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
                    borderRadius: 4,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: animatingCards.has(`action-${index}`) ? 'scale(0.95)' : 'scale(1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                      opacity: hoveredCard === index ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                      '& .action-icon': {
                        transform: 'scale(1.2) rotate(5deg)'
                      },
                      '& .action-arrow': {
                        transform: 'translateX(8px)',
                        opacity: 1
                      }
                    }
                  }}
                >
                  <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Box
                      className="action-icon"
                      sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: isSmallScreen ? '1.1rem' : '1.25rem'
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        opacity: 0.9,
                        fontSize: isSmallScreen ? '0.875rem' : '0.9rem'
                      }}
                    >
                      {action.description}
                    </Typography>
                    <ArrowForward
                      className="action-arrow"
                      sx={{
                        fontSize: 24,
                        opacity: 0.7,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </Box>
                  {/* Animated background particles */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                      '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.6)',
                        animation: 'float 6s ease-in-out infinite'
                      },
                      '&::before': {
                        top: '20%',
                        left: '20%',
                        animationDelay: '0s'
                      },
                      '&::after': {
                        top: '70%',
                        right: '20%',
                        animationDelay: '3s'
                      }
                    }}
                  />
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Three Column Layout */}
        <Slide direction="up" in={pageLoaded} timeout={1800}>
          <Grid container spacing={3}>
            {/* Left Column - Profile Status & Tips */}
            <Grid item xs={12} md={4}>
              <Grow in={pageLoaded} timeout={2000}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Person sx={{ color: '#4caf50' }} />
                      Profile Status
                    </Typography>
                    {stats && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Profile Completion</Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {stats.stats.profile_completion}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={stats.stats.profile_completion}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
                              borderRadius: 5
                            }
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      <Chip
                        label="Profile Complete"
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        label="Resume Uploaded"
                        color="primary"
                        size="small"
                        icon={<Description />}
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        label="Projects Added"
                        color="info"
                        size="small"
                        icon={<Work />}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      💡 Quick Tips
                    </Typography>
                    <List dense>
                      {studentTips.map((tip, index) => (
                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={tip}
                            primaryTypographyProps={{
                              fontSize: '14px',
                              color: 'text.primary',
                              fontWeight: 500
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

          {/* Middle Column - Recent Activities */}
          <Grid item xs={12} md={4}>
            <Grow in={pageLoaded} timeout={2200}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 'bold',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Timeline sx={{ color: '#2196f3' }} />
                    Recent Activities
                  </Typography>

                  <List dense>
                    {recentActivities.map((activity, index) => (
                      <ListItem key={index} sx={{ py: 1.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: activity.status === 'completed' ? '#4caf50' : '#ff9800',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {activity.status === 'completed' ?
                              <CheckCircle sx={{ fontSize: 16, color: 'white' }} /> :
                              <Timeline sx={{ fontSize: 16, color: 'white' }} />
                            }
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.activity}
                          secondary={activity.time}
                          primaryTypographyProps={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                          secondaryTypographyProps={{
                            fontSize: '12px',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Timeline />}
                    sx={{
                      borderRadius: 3,
                      py: 1,
                      borderColor: '#2196f3',
                      color: '#2196f3',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                      }
                    }}
                  >
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Right Column - Next Steps & Performance */}
          <Grid item xs={12} md={4}>
            <Grow in={pageLoaded} timeout={2400}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 'bold',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Analytics sx={{ color: '#9c27b0' }} />
                    Performance Insights
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'linear-gradient(135deg, #2196f3, #64b5f6)',
                          mr: 2,
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                        }}
                      >
                        <Assignment sx={{ color: 'white', fontSize: 24 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                          {stats?.stats.pending_applications || 0} Applications Pending
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Under review by companies
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'linear-gradient(135deg, #ff9800, #ffb74d)',
                          mr: 2,
                          boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                        }}
                      >
                        <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                          {stats?.stats.recent_drive_applications || 0} New This Month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Drive applications this month
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                          mr: 2,
                          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                        }}
                      >
                        <ShowChart sx={{ color: 'white', fontSize: 24 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                          {stats?.stats.placement_rate || 0}% Success Rate
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Higher than average!
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ArrowForward />}
                    onClick={() => navigate('/student')}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                      },
                      '&:active': {
                        transform: 'translateY(0px)'
                      }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Slide>
    </Container>

    {/* Custom CSS for animations */}
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `}</style>
  </Box>
);
};

export default StudentWelcome;