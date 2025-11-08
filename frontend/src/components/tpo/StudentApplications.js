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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Assignment,
  Person,
  School,
  TrendingUp,
  CheckCircle,
  Warning,
  Refresh,
  Visibility,
  FilterList,
  Download,
  RateReview,
  Assessment
} from '@mui/icons-material';
// import { tpoService } from '../../services/tpoService'; // Temporarily disabled to avoid API calls

const StudentApplications = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    cgpa_min: '',
    cgpa_max: '',
    skill: ''
  });

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      student_id: 1,
      student_name: 'John Doe',
      email: 'john.doe@student.edu',
      cgpa: 8.5,
      skills: ['Python', 'Java', 'JavaScript'],
      resume_score: 85,
      application_date: '2025-11-01',
      status: 'pending',
      drive_name: 'Google Software Engineer Drive',
      position: 'Software Engineer',
      status_history: [
        { status: 'applied', date: '2025-11-01' },
        { status: 'screened', date: '2025-11-02' }
      ]
    },
    {
      id: 2,
      student_id: 2,
      student_name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      cgpa: 9.2,
      skills: ['React', 'Node.js', 'Python', 'MongoDB'],
      resume_score: 92,
      application_date: '2025-11-02',
      status: 'shortlisted',
      drive_name: 'Microsoft Frontend Developer',
      position: 'Frontend Developer',
      status_history: [
        { status: 'applied', date: '2025-11-02' },
        { status: 'screened', date: '2025-11-03' },
        { status: 'shortlisted', date: '2025-11-05' }
      ]
    },
    {
      id: 3,
      student_id: 3,
      student_name: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      cgpa: 7.8,
      skills: ['Java', 'Spring Boot', 'MySQL'],
      resume_score: 78,
      application_date: '2025-11-03',
      status: 'rejected',
      drive_name: 'Amazon Backend Engineer',
      position: 'Backend Engineer',
      status_history: [
        { status: 'applied', date: '2025-11-03' },
        { status: 'screened', date: '2025-11-04' },
        { status: 'rejected', date: '2025-11-06' }
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data instead of API call
      setInsights({
        insights: {
          overall_assessment: 'Strong application pool with high-quality candidates',
          analytics: {
            total_applications: 150,
            eligible_applications: 120,
            avg_cgpa: 8.2,
            application_quality: 'High'
          },
          key_insights: [
            'High percentage of students meet eligibility criteria',
            'Good skill diversity across applications',
            'Strong technical background in most applications'
          ],
          action_items: [
            'Review 50 top applications',
            'Schedule technical interviews',
            'Update eligibility criteria'
          ],
          trends: {
            application_rate: 'increasing',
            quality_trend: 'improving',
            diversity_trend: 'stable'
          },
          recommendations: [
            'Schedule interviews for top candidates',
            'Focus on students with specific skills',
            'Consider fast-track process for high CGPA students'
          ]
        }
      });
      setApplications(mockApplications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'interview': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted': return <CheckCircle />;
      case 'pending': return <Assignment />;
      case 'rejected': return <Warning />;
      case 'interview': return <Person />;
      default: return <Assignment />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filters.status !== 'all' && app.status !== filters.status) return false;
    if (filters.cgpa_min && app.cgpa < parseFloat(filters.cgpa_min)) return false;
    if (filters.cgpa_max && app.cgpa > parseFloat(filters.cgpa_max)) return false;
    if (filters.skill && !app.skills.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase()))) return false;
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Application Data...</Typography>
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
          Student Applications Management
        </Typography>
        <Box>
          <Button
            onClick={() => setFilterOpen(true)}
            startIcon={<FilterList />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            onClick={loadData}
            startIcon={<Refresh />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            variant="contained"
            color="success"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* AI Insights Section */}
      {insights && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" display="flex" alignItems="center">
                  <Assessment sx={{ mr: 1 }} />
                  AI-Powered Application Insights
                </Typography>
                
                <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                  {insights.insights?.overall_assessment}
                </Typography>

                {/* Analytics */}
                {insights.insights?.analytics && (
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.entries(insights.insights.analytics).map(([key, value]) => (
                      <Grid item xs={6} sm={3} key={key}>
                        <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Key Insights */}
                {insights.insights?.key_insights && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Key Insights</Typography>
                    <List>
                      {insights.insights.key_insights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TrendingUp color="success" />
                          </ListItemIcon>
                          <ListItemText primary={insight} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Action Items */}
                {insights.insights?.action_items && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Recommended Actions</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {insights.insights.action_items.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          color="primary"
                          variant="outlined"
                          icon={<CheckCircle />}
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
                <Typography variant="h6" gutterBottom>Application Trends</Typography>
                
                {insights.insights?.trends && (
                  <Box>
                    {Object.entries(insights.insights.trends).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            {key.replace(/_/g, ' ').toUpperCase()}
                          </Typography>
                          <Chip
                            size="small"
                            label={value}
                            color={value === 'increasing' || value === 'improving' ? 'success' : 'default'}
                            icon={value === 'increasing' || value === 'improving' ? <TrendingUp /> : null}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {insights.insights?.recommendations && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Recommendations</Typography>
                    <List dense>
                      {insights.insights.recommendations.map((rec, index) => (
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Applications Table */}
      <Card className="animated-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Student Applications
            </Typography>
            <Chip
              label={`${filteredApplications.length} Applications`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(0,0,0,0.04)' }}>
                  <TableCell>Student</TableCell>
                  <TableCell>Application Details</TableCell>
                  <TableCell>CGPA & Skills</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow
                    key={app.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(0,0,0,0.02)',
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {app.student_name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {app.student_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {app.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {app.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {app.drive_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Applied: {new Date(app.application_date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" mb={1}>
                        <School sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {app.cgpa} CGPA
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(app.cgpa / 10) * 100}
                        sx={{ mb: 1, borderRadius: 5, height: 6 }}
                        color={app.cgpa >= 8 ? 'success' : app.cgpa >= 7 ? 'warning' : 'error'}
                      />
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {app.skills.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {app.skills.length > 3 && (
                          <Chip
                            label={`+${app.skills.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        icon={getStatusIcon(app.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Score: {app.resume_score}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <RateReview />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredApplications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No applications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or check back later
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Applications</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="interview">Interview</option>
            </TextField>
            <Box display="flex" gap={2}>
              <TextField
                label="Min CGPA"
                type="number"
                value={filters.cgpa_min}
                onChange={(e) => setFilters({...filters, cgpa_min: e.target.value})}
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 10 }}
              />
              <TextField
                label="Max CGPA"
                type="number"
                value={filters.cgpa_max}
                onChange={(e) => setFilters({...filters, cgpa_max: e.target.value})}
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 10 }}
              />
            </Box>
            <TextField
              label="Filter by Skill"
              value={filters.skill}
              onChange={(e) => setFilters({...filters, skill: e.target.value})}
              fullWidth
              placeholder="e.g., Python, Java, React"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setFilterOpen(false);
              loadData();
            }} 
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentApplications;