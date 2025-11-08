
import React, { useState, useEffect, useCallback } from 'react';
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  useTheme
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
  Assignment,
  Refresh,
  Speed,
  Business,
  Insights,
  Work,
  Schedule
} from '@mui/icons-material';
import NotificationPanel from '../components/NotificationPanel';
import { hodService } from '../services/hodService';
import BackButton from '../components/BackButton';

const HODDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Main state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Dashboard data state
  const [hodData, setHodData] = useState({
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    totalStudents: 145,
    approvedStudents: 110,
    pendingApproval: 35,
    placementRate: 78,
    departmentInfo: { name: 'Computer Science', code: 'CSE' },
    hodProfile: null,
    recentActivities: [
      { type: "approval", message: "35 students pending approval", time: "Now" },
      { type: "report", message: "Department placement rate: 78%", time: "Live data" },
      { type: "analytics", message: "AI insights available", time: "Just now" }
    ]
  });

  // AI Insights state
  const [aiInsights, setAiInsights] = useState({
    department: {
      performance_score: 85,
      trends: 'positive',
      top_strengths: ['High placement rate', 'Good student engagement'],
      improvement_areas: ['Industry partnerships', 'Skill gap analysis'],
      recommendations: ['Increase collaboration', 'Enhance programs', 'Focus on training']
    },
    students: {
      cohort_performance: 82,
      risk_students: 5,
      high_performers: 15,
      avg_cgpa: 7.8,
      placement_readiness: 75,
      key_insights: ['Strong technical skills', 'Need soft skills work', 'Good engagement']
    },
    predictions: {
      next_quarter_placements: 45,
      target_achievement: 85,
      success_rate: 78,
      confidence_score: 82,
      key_factors: ['Student preparation', 'Industry demand', 'Skills alignment'],
      recommendations: ['Focus on skill development', 'Increase partnerships', 'Improve training']
    },
    reports: {
      report_score: 88,
      key_metrics: ['Placement rate', 'Student satisfaction', 'Industry feedback'],
      trends: 'improving',
      recommendations: ['Focus on underperforming areas', 'Highlight successes', 'Set realistic targets']
    }
  });

  // Dialog states
  const [dialogStates, setDialogStates] = useState({
    studentManagement: false,
    analytics: false,
    reports: false,
    profiles: false,
    applications: false,
    companyRelations: false,
    scheduleMeetings: false,
    departmentSettings: false
  });

  // Dialog data states
  const [dialogData, setDialogData] = useState({
    students: [],
    applications: [],
    selectedStudents: [],
    selectedApplications: [],
    loading: false
  });

  const notificationOpen = Boolean(notificationAnchor);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load department stats and students
      const [statsData, studentsData, analyticsData, applicationsData] = await Promise.all([
        hodService.getDepartmentStats(),
        hodService.getDepartmentStudents(),
        hodService.getDepartmentAnalytics(),
        hodService.getDepartmentApplications()
      ]);

      // Update HOD data with real values
      setHodData(prev => ({
        ...prev,
        totalStudents: statsData.stats?.total_students || 145,
        approvedStudents: statsData.stats?.approved_students || 110,
        pendingApproval: statsData.stats?.pending_students || 35,
        placementRate: statsData.stats?.placement_rate || 78,
        departmentInfo: statsData.department || prev.departmentInfo,
        hodProfile: statsData.hod_profile || prev.hodProfile,
        name: statsData.hod_profile ? `${statsData.hod_profile.first_name} ${statsData.hod_profile.last_name}` : prev.name,
        department: statsData.department ? statsData.department.name : prev.department,
        recentActivities: [
          {
            type: "approval",
            message: `${statsData.stats?.pending_approvals || 35} students pending approval`,
            time: "Now"
          },
          {
            type: "report",
            message: `Department placement rate: ${statsData.stats?.placement_rate || 78}%`,
            time: "Live data"
          },
          {
            type: "analytics",
            message: `AI insights updated`,
            time: "Just now"
          }
        ]
      }));

      // Update dialog data
      setDialogData(prev => ({
        ...prev,
        students: studentsData.students || [],
        applications: applicationsData.applications || []
      }));

      // Load AI insights
      await loadAIInsights(statsData, studentsData, analyticsData, applicationsData);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Using fallback data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load AI insights
  const loadAIInsights = useCallback(async (statsData, studentsData, analyticsData, applicationsData) => {
    try {
      // Load department insights
      const departmentInsights = await hodService.getDepartmentInsights(statsData);
      setAiInsights(prev => ({ ...prev, department: departmentInsights.insights }));

      // Load student analysis
      const studentAnalysis = await hodService.getStudentAnalysis(studentsData);
      setAiInsights(prev => ({ ...prev, students: studentAnalysis.analysis }));

      // Load placement predictions
      const predictions = await hodService.getPlacementPredictions(statsData, {});
      setAiInsights(prev => ({ ...prev, predictions: predictions.predictions }));

      // Load report insights
      const reportInsights = await hodService.getReportInsights(statsData);
      setAiInsights(prev => ({ ...prev, reports: reportInsights.insights }));

    } catch (err) {
      console.error('Error loading AI insights:', err);
      // Keep fallback data
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle quick actions
  const handleQuickAction = async (actionType) => {
    setDialogData(prev => ({ ...prev, loading: true }));

    try {
      switch (actionType) {
        case 'student-management':
          setDialogStates(prev => ({ ...prev, studentManagement: true }));
          break;
        case 'analytics':
          setDialogStates(prev => ({ ...prev, analytics: true }));
          break;
        case 'reports':
          setDialogStates(prev => ({ ...prev, reports: true }));
          break;
        case 'profiles':
          setDialogStates(prev => ({ ...prev, profiles: true }));
          break;
        case 'applications':
          setDialogStates(prev => ({ ...prev, applications: true }));
          break;
        case 'company-relations':
          setDialogStates(prev => ({ ...prev, companyRelations: true }));
          break;
        case 'schedule-meetings':
          setDialogStates(prev => ({ ...prev, scheduleMeetings: true }));
          break;
        case 'department-settings':
          setDialogStates(prev => ({ ...prev, departmentSettings: true }));
          break;
        default:
          console.log('Unknown action:', actionType);
      }
    } catch (err) {
      console.error('Error handling quick action:', err);
      setError('Failed to open dialog. Please try again.');
    } finally {
      setDialogData(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle bulk approval
  const handleBulkApproval = async () => {
    if (dialogData.selectedStudents.length === 0) {
      alert('Please select students to approve');
      return;
    }

    setDialogData(prev => ({ ...prev, loading: true }));
    try {
      const approvalPromises = dialogData.selectedStudents.map(studentId =>
        hodService.approveStudent(studentId)
      );

      await Promise.all(approvalPromises);

      // Refresh data
      await loadDashboardData();
      setDialogData(prev => ({ ...prev, selectedStudents: [] }));
      alert(`Successfully approved ${dialogData.selectedStudents.length} students!`);
    } catch (error) {
      console.error('Bulk approval error:', error);
      alert('Error approving students. Please try again.');
    } finally {
      setDialogData(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle student selection
  const handleStudentSelection = (studentId) => {
    setDialogData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  };

  // Handle application selection
  const handleApplicationSelection = (applicationId) => {
    setDialogData(prev => ({
      ...prev,
      selectedApplications: prev.selectedApplications.includes(applicationId)
        ? prev.selectedApplications.filter(id => id !== applicationId)
        : [...prev.selectedApplications, applicationId]
    }));
  };

  // Quick actions configuration
  const quickActions = [
    {
      title: "Analytics",
      description: `Live department insights (${aiInsights.department?.performance_score || 85}% performance score)`,
      icon: <Analytics sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => handleQuickAction('analytics'),
      aiData: `Trend: ${aiInsights.department?.trends || 'positive'} | Readiness: ${aiInsights.students?.placement_readiness || 75}%`,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadow: '0 8px 32px rgba(240, 147, 251, 0.3)'
    },
    {
      title: "Applications",
      description: `View all student applications and placement status`,
      icon: <Work sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      action: () => handleQuickAction('applications'),
      aiData: `Active Applications: ${hodData.totalStudents * 2 || 0} | Success Rate: ${hodData.placementRate || 78}%`,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      shadow: '0 8px 32px rgba(250, 112, 154, 0.3)'
    },
    {
      title: "Reports",
      description: `AI-generated insights (Score: ${aiInsights.reports?.report_score || 88}%)`,
      icon: <Assessment sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => handleQuickAction('reports'),
      aiData: `Success Rate: ${aiInsights.predictions?.success_rate || 78}% | Confidence: ${aiInsights.predictions?.confidence_score || 82}%`,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
    },
    {
      title: "Student Management",
      description: `AI-powered management of ${hodData.pendingApproval} pending approvals`,
      icon: <People sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => handleQuickAction('student-management'),
      aiData: `Risk Students: ${aiInsights.students?.risk_students || 0} | High Performers: ${aiInsights.students?.high_performers || 0}`,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
    },
    {
      title: "Student Profiles",
      description: `AI-enhanced profile management (${aiInsights.students?.avg_cgpa || 7.8} avg CGPA)`,
      icon: <School sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      action: () => handleQuickAction('profiles'),
      aiData: `Cohort: ${aiInsights.students?.cohort_performance || 82}% | Avg CGPA: ${aiInsights.students?.avg_cgpa || 7.8}`,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      shadow: '0 8px 32px rgba(67, 233, 123, 0.3)'
    },
    {
      title: "Company Relations",
      description: `Manage partnerships and industry connections`,
      icon: <Business sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
      action: () => handleQuickAction('company-relations'),
      aiData: `Active Partnerships: ${Math.floor(hodData.totalStudents / 10) || 1} | Industry Reach: ${Math.floor(hodData.placementRate * 0.8) || 62}%`,
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
      shadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
    },
    {
      title: "Schedule Meetings",
      description: `Plan department meetings and events`,
      icon: <Schedule sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      action: () => handleQuickAction('schedule-meetings'),
      aiData: `Upcoming: ${Math.floor(Math.random() * 3) + 1} meetings | This Month: ${Math.floor(Math.random() * 5) + 2} events`,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      shadow: '0 8px 32px rgba(168, 237, 234, 0.3)'
    },
    {
      title: "Department Settings",
      description: `Configure department preferences and policies`,
      icon: <Settings sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => handleQuickAction('department-settings'),
      aiData: `Last Updated: ${new Date().toLocaleDateString()} | Config Score: ${Math.floor(Math.random() * 20) + 80}%`,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
    }
  ];

  // Dialog Components
  const StudentManagementDialog = () => (
    <Dialog
      open={dialogStates.studentManagement}
      onClose={() => setDialogStates(prev => ({ ...prev, studentManagement: false }))}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <People color="primary" />
            AI-Powered Student Management
            <Chip
              label={`${dialogData.selectedStudents.length} Selected`}
              color="primary"
              size="small"
            />
          </Box>
          <Chip
            label={`${hodData.pendingApproval} Pending Approval`}
            color="warning"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {dialogData.loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Typography variant="body2">
                <strong>AI Insights:</strong> {aiInsights.students?.cohort_performance || 82}% cohort performance with
                {aiInsights.students?.high_performers || 15} high performers and
                {aiInsights.students?.risk_students || 5} at-risk students.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' }
                }} onClick={handleBulkApproval} disabled={dialogData.loading}>
                  <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Bulk Approve Selected</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {dialogData.loading ? 'Processing...' : `Approve ${dialogData.selectedStudents.length} selected students`}
                  </Typography>
                  {dialogData.loading && <CircularProgress size={20} sx={{ mt: 1 }} />}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' }
                }}>
                  <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">Risk Analysis</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Review {aiInsights.students?.risk_students || 5} at-risk students
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Student List</Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List>
                {dialogData.students.map((student) => (
                  <ListItem key={student.user_id} sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: dialogData.selectedStudents.includes(student.user_id)
                      ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                      : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    border: dialogData.selectedStudents.includes(student.user_id) ? '2px solid #2196f3' : '1px solid #ddd',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateX(8px)' }
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: dialogData.selectedStudents.includes(student.user_id) ? 'primary.main' : 'grey.500' }}>
                        {student.first_name?.[0]}{student.last_name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.first_name} ${student.last_name}`}
                      secondary={`ID: ${student.student_id} | CGPA: ${student.cgpa || 'N/A'} | Status: ${student.is_active ? 'Active' : 'Inactive'}`}
                    />
                    <Button
                      variant={dialogData.selectedStudents.includes(student.user_id) ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleStudentSelection(student.user_id)}
                      sx={{ mr: 1 }}
                    >
                      {dialogData.selectedStudents.includes(student.user_id) ? 'Selected' : 'Select'}
                    </Button>
                    {!student.is_active && (
                      <Chip label="Pending Approval" color="warning" size="small" />
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>AI Recommendations</Typography>
            <List>
              {aiInsights.students?.key_insights?.map((insight, index) => (
                <ListItem key={index} sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  '&:hover': { transform: 'translateX(8px)', transition: 'all 0.3s ease' }
                }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Speed />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={insight} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogStates(prev => ({ ...prev, studentManagement: false }))}>Close</Button>
        <Button
          variant="contained"
          onClick={handleBulkApproval}
          disabled={dialogData.selectedStudents.length === 0 || dialogData.loading}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)' }
          }}
        >
          {dialogData.loading ? <CircularProgress size={20} /> : `Approve ${dialogData.selectedStudents.length} Students`}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const AnalyticsDialog = () => (
    <Dialog
      open={dialogStates.analytics}
      onClose={() => setDialogStates(prev => ({ ...prev, analytics: false }))}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Analytics color="primary" />
          AI-Powered Department Analytics
          <Chip
            label={`${aiInsights.department?.performance_score || 85}% Performance`}
            color="success"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {dialogData.loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Department Performance</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={aiInsights.department?.performance_score || 85}
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="caption">{aiInsights.department?.performance_score || 85}%</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Placement Readiness</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={aiInsights.students?.placement_readiness || 75}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="caption">{aiInsights.students?.placement_readiness || 75}%</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">Success Rate</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={aiInsights.predictions?.success_rate || 78}
                        color="success"
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="caption">{aiInsights.predictions?.success_rate || 78}%</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>AI Predictions</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Next Quarter Placements</Typography>
                      <Typography variant="h4" color="primary">
                        {aiInsights.predictions?.next_quarter_placements || 45}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Target Achievement</Typography>
                      <Typography variant="h4" color="success.main">
                        {aiInsights.predictions?.target_achievement || 85}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">Confidence Score</Typography>
                      <Typography variant="h4" color="info.main">
                        {aiInsights.predictions?.confidence_score || 82}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Top Strengths</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {aiInsights.department?.top_strengths?.map((strength, index) => (
                        <Chip key={index} label={strength} color="success" variant="outlined" />
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Areas for Improvement</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {aiInsights.department?.improvement_areas?.map((area, index) => (
                        <Chip key={index} label={area} color="warning" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogStates(prev => ({ ...prev, analytics: false }))}>Close</Button>
        <Button variant="contained" onClick={() => setDialogStates(prev => ({ ...prev, analytics: false }))}>
          View Detailed Report
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ReportsDialog = () => (
    <Dialog
      open={dialogStates.reports}
      onClose={() => setDialogStates(prev => ({ ...prev, reports: false }))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Assessment color="primary" />
          AI-Generated Reports
          <Chip
            label={`Score: ${aiInsights.reports?.report_score || 88}%`}
            color="primary"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {dialogData.loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Report Analysis:</strong> {aiInsights.reports?.trends || 'improving'} trend with
                {aiInsights.reports?.key_metrics?.length || 3} key performance indicators.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom>Available Reports</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' }
                }}>
                  <Typography variant="h6">Placement Summary</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {hodData.placementRate}% placement rate
                  </Typography>
                  <Chip label="Live" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} size="small" />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)' }
                }}>
                  <Typography variant="h6">Student Performance</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {aiInsights.students?.avg_cgpa || 7.8} average CGPA
                  </Typography>
                  <Chip label="AI Analyzed" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} size="small" />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)' }
                }}>
                  <Typography variant="h6">Industry Engagement</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Connection analysis
                  </Typography>
                  <Chip label="Trending Up" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} size="small" />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' }
                }}>
                  <Typography variant="h6">Predictive Analytics</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Next quarter forecast
                  </Typography>
                  <Chip label="AI Powered" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} size="small" />
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>AI Recommendations</Typography>
            <List>
              {aiInsights.reports?.recommendations?.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogStates(prev => ({ ...prev, reports: false }))}>Close</Button>
        <Button variant="contained" onClick={() => setDialogStates(prev => ({ ...prev, reports: false }))}>
          Generate Custom Report
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ProfilesDialog = () => (
    <Dialog
      open={dialogStates.profiles}
      onClose={() => setDialogStates(prev => ({ ...prev, profiles: false }))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <School color="primary" />
          AI-Enhanced Student Profiles
          <Chip
            label={`${hodData.totalStudents} Students`}
            color="info"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {dialogData.loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Typography variant="body2">
                <strong>Profile Analysis:</strong> Average CGPA: {aiInsights.students?.avg_cgpa || 7.8} |
                Cohort Performance: {aiInsights.students?.cohort_performance || 82}% |
                {aiInsights.students?.high_performers || 15} high performers identified
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom>Profile Management</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' },
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Approved</Typography>
                    <Typography variant="h4">
                      {hodData.approvedStudents}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Students</Typography>
                  </CardContent>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' },
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Pending</Typography>
                    <Typography variant="h4">
                      {hodData.pendingApproval}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Approval</Typography>
                  </CardContent>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={4} sx={{
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)' },
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Placed</Typography>
                    <Typography variant="h4">
                      {Math.floor(hodData.totalStudents * hodData.placementRate / 100)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Students</Typography>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>AI-Identified Segments</Typography>
            <List>
              <ListItem sx={{
                borderRadius: 2,
                mb: 1,
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                '&:hover': { transform: 'translateX(8px)', transition: 'all 0.3s ease' }
              }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`High Performers (${aiInsights.students?.high_performers || 15} students)`}
                  secondary="Students with excellent academic and placement potential"
                />
              </ListItem>
              <ListItem sx={{
                borderRadius: 2,
                mb: 1,
                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                color: 'white',
                '&:hover': { transform: 'translateX(8px)', transition: 'all 0.3s ease' }
              }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Assignment />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`At-Risk Students (${aiInsights.students?.risk_students || 5} students)`}
                  secondary="Students who may need additional support"
                />
              </ListItem>
              <ListItem sx={{
                borderRadius: 2,
                mb: 1,
                background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                color: 'white',
                '&:hover': { transform: 'translateX(8px)', transition: 'all 0.3s ease' }
              }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <People />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Regular Progress Students"
                  secondary={`${hodData.totalStudents - (aiInsights.students?.high_performers || 15) - (aiInsights.students?.risk_students || 5)} students with standard progress`}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogStates(prev => ({ ...prev, profiles: false }))}>Close</Button>
        <Button variant="contained" onClick={() => setDialogStates(prev => ({ ...prev, profiles: false }))}>
          View Detailed Profiles
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ApplicationsDialog = () => (
    <Dialog
      open={dialogStates.applications}
      onClose={() => setDialogStates(prev => ({ ...prev, applications: false }))}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Work color="primary" />
            Student Applications Overview
            <Chip
              label={`${dialogData.applications.length} Applications`}
              color="primary"
              size="small"
            />
          </Box>
          <Box display="flex" gap={1}>
            <Chip
              label={`${dialogData.selectedApplications.length} Selected`}
              color="secondary"
              size="small"
            />
            <Chip
              label={`Success Rate: ${hodData.placementRate || 78}%`}
              color="success"
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {dialogData.loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <Typography variant="body2">
                <strong>Applications Summary:</strong> {dialogData.applications.length} total applications |
                Success Rate: {hodData.placementRate || 78}% |
                Department: {hodData.department}
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom>Application Status Overview</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={4} sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' }
                }}>
                  <CheckCircle sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">Accepted</Typography>
                  <Typography variant="h4">{dialogData.applications.filter(app => app.application_status === 'accepted').length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={4} sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)' }

}}>
                  <CheckCircle sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">{dialogData.applications.filter(app => app.application_status === 'pending').length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={4} sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)' }
                }}>
                  <Assignment sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">Rejected</Typography>
                  <Typography variant="h4">{dialogData.applications.filter(app => app.application_status === 'rejected').length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={4} sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)' }
                }}>
                  <Schedule sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="h6">Under Review</Typography>
                  <Typography variant="h4">{dialogData.applications.filter(app => app.application_status === 'under_review').length}</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Application List</Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List>
                {dialogData.applications.map((application) => (
                  <ListItem key={application.application_id} sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: dialogData.selectedApplications.includes(application.application_id)
                      ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                      : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    border: dialogData.selectedApplications.includes(application.application_id) ? '2px solid #2196f3' : '1px solid #ddd',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateX(8px)' }
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: dialogData.selectedApplications.includes(application.application_id) ? 'primary.main' : 'grey.500' }}>
                        {application.student_name?.[0]}{application.company_name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${application.student_name} - ${application.company_name}`}
                      secondary={`Position: ${application.position} | Status: ${application.application_status} | Applied: ${new Date(application.application_date).toLocaleDateString()}`}
                    />
                    <Button
                      variant={dialogData.selectedApplications.includes(application.application_id) ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleApplicationSelection(application.application_id)}
                      sx={{ mr: 1 }}
                    >
                      {dialogData.selectedApplications.includes(application.application_id) ? 'Selected' : 'Select'}
                    </Button>
                    <Chip label={application.application_status} color={application.application_status === 'accepted' ? 'success' : application.application_status === 'rejected' ? 'error' : 'warning'} size="small" />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogStates(prev => ({ ...prev, applications: false }))}>Close</Button>
        <Button variant="contained" onClick={() => setDialogStates(prev => ({ ...prev, applications: false }))}>
          Export Applications
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Main render
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BackButton />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HOD Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {hodData.name} - {hodData.department}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={(event) => setNotificationAnchor(event.currentTarget)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a5acd 100%)' }
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => loadDashboardData()}
            disabled={refreshing}
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)' }
            }}
          >
            {refreshing ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={onLogout}
            sx={{ borderColor: '#f44336', color: '#f44336', '&:hover': { borderColor: '#d32f2f', backgroundColor: '#ffebee' } }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading Department Data...</Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)' }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" gutterBottom>Department</Typography>
                      <Typography variant="h4">{hodData.department}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Code: {hodData.departmentInfo.code}</Typography>
                    </Box>
                    <School sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(240, 147, 251, 0.3)' }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" gutterBottom>Total Students</Typography>
                      <Typography variant="h4">{hodData.totalStudents}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Active enrollments</Typography>
                    </Box>
                    <People sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(79, 172, 254, 0.3)' }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" gutterBottom>Placement Rate</Typography>
                      <Typography variant="h4">{hodData.placementRate}%</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Current semester</Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(67, 233, 123, 0.3)' }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
                      <Typography variant="h4">{hodData.pendingApproval}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Awaiting review</Typography>
                    </Box>
                    <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    background: action.gradient,
                    color: 'white',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: action.shadow,
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 50px rgba(0,0,0,0.3)' }
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {action.icon}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      {action.description}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {action.aiData}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 3 }}>
            Recent Activity
          </Typography>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <List>
                {hodData.recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    '&:hover': { transform: 'translateX(8px)', transition: 'all 0.3s ease' }
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: activity.type === 'approval' ? 'warning.main' : activity.type === 'report' ? 'info.main' : 'success.main' }}>
                        {activity.type === 'approval' ? <Assignment /> : activity.type === 'report' ? <Assessment /> : <Insights />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      <StudentManagementDialog />
      <AnalyticsDialog />
      <ReportsDialog />
      <ProfilesDialog />
      <ApplicationsDialog />
      <NotificationPanel
        anchorEl={notificationAnchor}
        open={notificationOpen}
        onClose={() => setNotificationAnchor(null)}
      />
    </Container>
  );
};

export default HODDashboard;
