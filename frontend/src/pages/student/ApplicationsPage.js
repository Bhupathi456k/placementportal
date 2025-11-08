import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  TrendingUp,
  School,
  Business,
  Assessment,
  SmartToy,
  Psychology,
  Timeline as TimelineIcon,
  ExpandMore,
  MarkEmailRead,
  Work,
  Flag,
  Insights,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../../services/authService';
import BackButton from '../../components/BackButton';

const ApplicationsPage = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [applicationInsights, setApplicationInsights] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/student/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        
        // Get AI analysis for applications
        await getAIAnalysis(data.applications);
        await getApplicationInsights(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAIAnalysis = async (apps) => {
    try {
      for (const app of apps) {
        const response = await fetch('/api/ai/application-analysis', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            application: app,
            student_profile: {
              skills: ['JavaScript', 'Python', 'React', 'Node.js'],
              cgpa: 8.5
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAiAnalysis(prev => ({
            ...prev,
            [app.id]: data.analysis
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    }
  };

  const getApplicationInsights = async (apps) => {
    try {
      const response = await fetch('/api/ai/application-insights', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applications: apps
        })
      });

      if (response.ok) {
        const data = await response.json();
        setApplicationInsights(data);
      }
    } catch (error) {
      console.error('Error fetching application insights:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#2196f3';
      case 'shortlisted': return '#ff9800';
      case 'interview_scheduled': return '#9c27b0';
      case 'interview_completed': return '#607d8b';
      case 'selected': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'placed': return '#2e7d32';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Assignment />;
      case 'shortlisted': return <Schedule />;
      case 'interview_scheduled': return <Schedule />;
      case 'interview_completed': return <MarkEmailRead />;
      case 'selected': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'placed': return <Work />;
      default: return <HourglassEmpty />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'shortlisted': return 'Shortlisted';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'interview_completed': return 'Interview Completed';
      case 'selected': return 'Selected';
      case 'rejected': return 'Rejected';
      case 'placed': return 'Placed';
      default: return 'Pending';
    }
  };

  const getApplicationSteps = (app) => {
    const steps = [
      { label: 'Application Submitted', status: 'completed' },
      { label: 'Application Reviewed', status: app.application_status !== 'applied' ? 'completed' : 'active' },
      { label: 'Shortlisted', status: ['shortlisted', 'interview_scheduled', 'interview_completed', 'selected', 'placed'].includes(app.application_status) ? 'completed' : 'pending' },
      { label: 'Interview Process', status: ['interview_scheduled', 'interview_completed', 'selected', 'placed'].includes(app.application_status) ? 'completed' : 'pending' },
      { label: 'Final Result', status: ['selected', 'placed', 'rejected'].includes(app.application_status) ? 'completed' : 'pending' }
    ];
    return steps;
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.application_status === filterStatus);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <LinearProgress sx={{ width: '200px' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative' }}>
      <BackButton />
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
          Applications Tracking
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            icon={<SmartToy />} 
            label="AI Analysis Available" 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={`${applications.length} Total Applications`} 
            color="primary"
          />
        </Box>
      </Box>

      {/* AI Insights */}
      {applicationInsights && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ mr: 2, fontSize: 30 }} />
              <Typography variant="h6">AI Application Insights</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applicationInsights.success_rate || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Success Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applicationInsights.average_time_to_response || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Response Time (days)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {applicationInsights.top_strength || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Top Strength
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label="All" 
              onClick={() => setFilterStatus('all')}
              color={filterStatus === 'all' ? 'primary' : 'default'}
            />
            <Chip 
              label="Applied" 
              onClick={() => setFilterStatus('applied')}
              color={filterStatus === 'applied' ? 'primary' : 'default'}
            />
            <Chip 
              label="Shortlisted" 
              onClick={() => setFilterStatus('shortlisted')}
              color={filterStatus === 'shortlisted' ? 'primary' : 'default'}
            />
            <Chip 
              label="Interview" 
              onClick={() => setFilterStatus('interview_scheduled')}
              color={filterStatus === 'interview_scheduled' ? 'primary' : 'default'}
            />
            <Chip 
              label="Selected" 
              onClick={() => setFilterStatus('selected')}
              color={filterStatus === 'selected' ? 'primary' : 'default'}
            />
            <Chip 
              label="Placed" 
              onClick={() => setFilterStatus('placed')}
              color={filterStatus === 'placed' ? 'primary' : 'default'}
            />
            <Chip 
              label="Rejected" 
              onClick={() => setFilterStatus('rejected')}
              color={filterStatus === 'rejected' ? 'primary' : 'default'}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Grid container spacing={3}>
        {filteredApplications.map((application) => {
          const aiAnalysisData = aiAnalysis[application.id];
          
          return (
            <Grid item xs={12} key={application.id}>
              <Card className="animated-card">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getStatusColor(application.application_status), 
                          mr: 2,
                          width: 50,
                          height: 50 
                        }}>
                          {getStatusIcon(application.application_status)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {application.drive?.company?.name} - {application.drive?.job_role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={getStatusText(application.application_status)}
                          sx={{ 
                            bgcolor: getStatusColor(application.application_status),
                            color: 'white'
                          }}
                        />
                      </Box>

                      {/* AI Analysis */}
                      {aiAnalysisData && (
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SmartToy sx={{ mr: 1, color: '#9c27b0' }} />
                              <Typography variant="subtitle1">AI Application Analysis</Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Match Score
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LinearProgress
                                      variant="determinate"
                                      value={aiAnalysisData.match_score || 0}
                                      sx={{ 
                                        flex: 1, 
                                        mr: 2, 
                                        height: 8, 
                                        borderRadius: 4 
                                      }}
                                    />
                                    <Typography variant="h6">
                                      {aiAnalysisData.match_score || 0}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Recommendation
                                  </Typography>
                                  <Typography variant="body2">
                                    {aiAnalysisData.recommendation || 'No specific recommendation available'}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {/* Application Process Timeline */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          Application Process
                        </Typography>
                        <Stepper orientation="vertical">
                          {getApplicationSteps(application).map((step, index) => (
                            <Step key={index} active={step.status === 'active'} completed={step.status === 'completed'}>
                              <StepLabel
                                StepIconComponent={(props) => {
                                  if (step.status === 'completed') {
                                    return <CheckCircle color="success" />;
                                  } else if (step.status === 'active') {
                                    return <Schedule color="primary" />;
                                  } else {
                                    return <HourglassEmpty color="disabled" />;
                                  }
                                }}
                              >
                                {step.label}
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          Application Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Company"
                              secondary={application.drive?.company?.name}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Position"
                              secondary={application.drive?.job_role}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Applied Date"
                              secondary={new Date(application.created_at).toLocaleDateString()}
                            />
                          </ListItem>
                          {application.ai_score && (
                            <ListItem>
                              <ListItemText 
                                primary="AI Match Score"
                                secondary={`${Math.round(application.ai_score)}%`}
                              />
                            </ListItem>
                          )}
                        </List>
                        
                        <Box sx={{ mt: 2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setSelectedApplication(application)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredApplications.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filterStatus === 'all' 
              ? 'Start applying to placement drives to track your applications here'
              : `No applications with status "${getStatusText(filterStatus)}"`
            }
          </Typography>
        </Box>
      )}

      {/* Application Details Dialog */}
      <Dialog
        open={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2 }} />
                {selectedApplication.drive?.company?.name} - Application Details
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Application Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Position"
                        secondary={selectedApplication.drive?.job_role}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Applied Date"
                        secondary={new Date(selectedApplication.created_at).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Current Status"
                        secondary={getStatusText(selectedApplication.application_status)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Drive Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Company"
                        secondary={selectedApplication.drive?.company?.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Location"
                        secondary={selectedApplication.drive?.location || 'Not specified'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Salary Range"
                        secondary={selectedApplication.drive?.salary_range || 'Not disclosed'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedApplication(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ApplicationsPage;