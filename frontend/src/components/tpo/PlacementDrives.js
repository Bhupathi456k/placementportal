import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  School,
  TrendingUp,
  People,
  CheckCircle,
  Schedule,
  Add,
  Edit,
  Refresh,
  Visibility,
  Analytics,
  Assessment,
  Event
} from '@mui/icons-material';
// import { tpoService } from '../../services/tpoService'; // Temporarily disabled to avoid API calls

const PlacementDrives = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDrive, setNewDrive] = useState({
    title: '',
    company_id: '',
    job_role: '',
    job_description: '',
    eligibility_criteria: '',
    package_offered: '',
    location: '',
    drive_date: '',
    application_deadline: '',
    max_applicants: '',
    min_cgpa: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data instead of API calls
      setAnalytics({
        analysis: {
          performance_score: 85,
          success_metrics: {
            applications_received: 150,
            candidates_shortlisted: 45,
            final_selections: 12,
            conversion_rate: '8%'
          },
          ai_insights: [
            'High application quality this quarter',
            'Strong technical round performance',
            'Good HR round completion rate'
          ],
          trends: {
            application_trend: 'increasing',
            quality_trend: 'stable',
            selection_trend: 'improving'
          },
          recommendations: [
            'Schedule similar drives in Q1',
            'Increase awareness campaigns',
            'Partner with more companies'
          ],
          improvement_suggestions: [
            'Increase technical preparation sessions',
            'Better pre-drive communication',
            'Streamline application process'
          ]
        }
      });

      setDrives([
        {
          id: 1,
          title: 'Software Engineer Role at Google',
          company_id: 1,
          job_role: 'Software Engineer',
          job_description: 'Develop and maintain scalable software solutions using modern technologies. Work on full-stack development with focus on backend services.',
          eligibility_criteria: 'B.Tech/M.Tech in CSE/IT/ECE, strong programming skills in Java/Python, knowledge of data structures and algorithms.',
          package_offered: '8-12 LPA',
          location: 'Bangalore',
          status: 'active',
          drive_date: '2025-12-15',
          application_deadline: '2025-12-10',
          max_applicants: 100,
          min_cgpa: 7.5
        },
        {
          id: 2,
          title: 'Data Analyst Position at Microsoft',
          company_id: 2,
          job_role: 'Data Analyst',
          job_description: 'Analyze large datasets to extract insights and support business decisions. Create reports and dashboards for stakeholders.',
          eligibility_criteria: 'B.Tech in CSE/IT/Mathematics, proficiency in SQL, Python, Excel, and data visualization tools like Tableau/Power BI.',
          package_offered: '6-10 LPA',
          location: 'Mumbai',
          status: 'scheduled',
          drive_date: '2025-12-20',
          application_deadline: '2025-12-15',
          max_applicants: 50,
          min_cgpa: 8.0
        },
        {
          id: 3,
          title: 'Full Stack Developer at Amazon',
          company_id: 3,
          job_role: 'Full Stack Developer',
          job_description: 'Build and maintain web applications using React, Node.js, and AWS services. Collaborate with cross-functional teams.',
          eligibility_criteria: 'B.Tech in CSE/IT, experience with MERN stack, knowledge of cloud platforms, good problem-solving skills.',
          package_offered: '10-15 LPA',
          location: 'Hyderabad',
          status: 'active',
          drive_date: '2025-12-25',
          application_deadline: '2025-12-20',
          max_applicants: 75,
          min_cgpa: 8.0
        },
        {
          id: 4,
          title: 'Machine Learning Engineer at Tesla',
          company_id: 4,
          job_role: 'Machine Learning Engineer',
          job_description: 'Develop ML models for autonomous vehicles and energy systems. Work with large datasets and implement AI solutions.',
          eligibility_criteria: 'B.Tech/M.Tech in CSE/AI, strong background in machine learning, Python, TensorFlow/PyTorch, statistics.',
          package_offered: '15-25 LPA',
          location: 'Pune',
          status: 'scheduled',
          drive_date: '2026-01-05',
          application_deadline: '2025-12-30',
          max_applicants: 30,
          min_cgpa: 8.5
        },
        {
          id: 5,
          title: 'DevOps Engineer at Netflix',
          company_id: 5,
          job_role: 'DevOps Engineer',
          job_description: 'Manage CI/CD pipelines, automate deployment processes, and ensure system reliability and scalability.',
          eligibility_criteria: 'B.Tech in CSE/IT, experience with Docker, Kubernetes, Jenkins, AWS/Azure, scripting languages.',
          package_offered: '12-18 LPA',
          location: 'Delhi',
          status: 'draft',
          drive_date: '2026-01-10',
          application_deadline: '2026-01-05',
          max_applicants: 40,
          min_cgpa: 7.8
        }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDriveDetails = async (driveId) => {
    try {
      // Use mock data instead of API call
      setSelectedDrive({
        analysis: {
          performance_score: 88,
          success_metrics: {
            applications_received: 75,
            candidates_shortlisted: 25,
            final_selections: 8,
            conversion_rate: '10.7%'
          }
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateDrive = async () => {
    try {
      // Mock drive creation instead of API call
      console.log('Creating drive:', newDrive);
      setDialogOpen(false);
      setNewDrive({
        title: '',
        company_id: '',
        job_role: '',
        job_description: '',
        eligibility_criteria: '',
        package_offered: '',
        location: '',
        drive_date: '',
        application_deadline: '',
        max_applicants: '',
        min_cgpa: ''
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'draft': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Drive Data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={loadData} startIcon={<Refresh />} variant="outlined">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Placement Drives Management
        </Typography>
        <Box>
          <Button
            onClick={loadData}
            startIcon={<Refresh />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            startIcon={<Add />}
            variant="contained"
          >
            Create Drive
          </Button>
        </Box>
      </Box>

      {/* AI Analytics Section */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" display="flex" alignItems="center">
                  <Analytics sx={{ mr: 1 }} />
                  AI-Powered Drive Analytics
                </Typography>
                
                {/* Performance Score */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {analytics.analysis?.performance_score || 0}/100
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Performance Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analytics.analysis?.performance_score || 0}
                    sx={{ mt: 1, borderRadius: 5, height: 8 }}
                    color="primary"
                  />
                </Box>

                {/* Success Metrics */}
                {analytics.analysis?.success_metrics && (
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.entries(analytics.analysis.success_metrics).map(([key, value]) => (
                      <Grid item xs={6} sm={3} key={key}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* AI Insights */}
                {analytics.analysis?.ai_insights && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Key Insights</Typography>
                    <List>
                      {analytics.analysis.ai_insights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={insight} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Trends */}
                {analytics.analysis?.trends && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Performance Trends</Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {Object.entries(analytics.analysis.trends).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key.replace(/_/g, ' ')}: ${value}`}
                          color={value === 'increasing' || value === 'improving' ? 'success' : 'default'}
                          icon={value === 'increasing' || value === 'improving' ? <TrendingUp /> : null}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>Drive Efficiency</Typography>
                
                {analytics.analysis?.recommendations && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>AI Recommendations</Typography>
                    <List dense>
                      {analytics.analysis.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={rec}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {analytics.analysis?.improvement_suggestions && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Improvement Areas</Typography>
                    <List dense>
                      {analytics.analysis.improvement_suggestions.map((suggestion, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Drives List */}
      <Card className="animated-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Placement Drives
            </Typography>
            <Chip
              label={`${drives.length} Total Drives`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <List>
            {drives.map((drive) => (
              <React.Fragment key={drive.id}>
                <ListItem
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      background: 'rgba(0,0,0,0.05)',
                      transform: 'translateX(8px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">{drive.title}</Typography>
                        <Chip
                          size="small"
                          label={drive.status}
                          color={getStatusColor(drive.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {drive.job_role} • {drive.location}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Chip
                            size="small"
                            label={`Max: ${drive.max_applicants} applicants`}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`Min CGPA: ${drive.min_cgpa || 'N/A'}`}
                            variant="outlined"
                          />
                          {drive.drive_date && (
                            <Chip
                              size="small"
                              label={`Date: ${new Date(drive.drive_date).toLocaleDateString()}`}
                              icon={<Event />}
                              variant="outlined"
                            />
                          )}
                        </Box>
                        {drive.package_offered && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Package: {drive.package_offered}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <IconButton
                      onClick={() => loadDriveDetails(drive.id)}
                      color="primary"
                    >
                      <Analytics />
                    </IconButton>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          {drives.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No placement drives found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first placement drive to get started
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Drive Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Placement Drive</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Drive Title"
                  value={newDrive.title}
                  onChange={(e) => setNewDrive({...newDrive, title: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Role"
                  value={newDrive.job_role}
                  onChange={(e) => setNewDrive({...newDrive, job_role: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  value={newDrive.job_description}
                  onChange={(e) => setNewDrive({...newDrive, job_description: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  value={newDrive.location}
                  onChange={(e) => setNewDrive({...newDrive, location: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Package Offered"
                  value={newDrive.package_offered}
                  onChange={(e) => setNewDrive({...newDrive, package_offered: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Drive Date"
                  type="date"
                  value={newDrive.drive_date}
                  onChange={(e) => setNewDrive({...newDrive, drive_date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Application Deadline"
                  type="date"
                  value={newDrive.application_deadline}
                  onChange={(e) => setNewDrive({...newDrive, application_deadline: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Max Applicants"
                  type="number"
                  value={newDrive.max_applicants}
                  onChange={(e) => setNewDrive({...newDrive, max_applicants: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min CGPA"
                  type="number"
                  value={newDrive.min_cgpa}
                  onChange={(e) => setNewDrive({...newDrive, min_cgpa: e.target.value})}
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Eligibility Criteria"
                  value={newDrive.eligibility_criteria}
                  onChange={(e) => setNewDrive({...newDrive, eligibility_criteria: e.target.value})}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateDrive} variant="contained">
            Create Drive
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlacementDrives;