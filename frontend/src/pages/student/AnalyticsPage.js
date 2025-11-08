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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  Assessment,
  School,
  Business,
  SmartToy,
  Psychology,
  Timeline,
  BarChart,
  PieChart,
  LineChart,
  Insights,
  Leaderboard,
  Dashboard,
  Star,
  StarBorder,
  CheckCircle,
  Schedule,
  People,
  Target
} from '@mui/icons-material';
import BackButton from '../../components/BackButton';
// Auth functions are imported directly from authService
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  Pie
} from 'recharts';

const AnalyticsPage = () => {
  // const { token } = useAuth(); // Temporarily disabled
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');
  const [activeTab, setActiveTab] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch comprehensive analytics data
      const response = await fetch(`/api/student/analytics?timeRange=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
        
        // Get AI insights and predictions
        await getAIInsights(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAIInsights = async (data) => {
    try {
      // Get AI-powered insights
      const insightsResponse = await fetch('/api/ai/placement-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_data: data,
          time_range: timeRange
        })
      });

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setAiInsights(insightsData);
      }

      // Get AI predictions
      const predictionsResponse = await fetch('/api/ai/placement-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_data: data,
          historical_trends: data.historical_trends
        })
      });

      if (predictionsResponse.ok) {
        const predictionsData = await predictionsResponse.json();
        setPredictions(predictionsData);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  // Mock data for demonstration
  const mockData = {
    application_trends: [
      { month: 'Jan', applications: 5, interviews: 2, placements: 0 },
      { month: 'Feb', applications: 8, interviews: 3, placements: 1 },
      { month: 'Mar', applications: 12, interviews: 5, placements: 2 },
      { month: 'Apr', applications: 15, interviews: 7, placements: 3 },
      { month: 'May', applications: 18, interviews: 8, placements: 4 },
      { month: 'Jun', applications: 22, interviews: 10, placements: 5 }
    ],
    success_rate: 68,
    average_response_time: 5.2,
    top_performing_skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    placement_probability: 85,
    industry_breakdown: [
      { name: 'Software Development', value: 45, color: '#8884d8' },
      { name: 'Data Science', value: 25, color: '#82ca9d' },
      { name: 'Web Development', value: 20, color: '#ffc658' },
      { name: 'Mobile Development', value: 10, color: '#ff7c7c' }
    ]
  };

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
          Placement Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1month">Last Month</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Chip 
            icon={<SmartToy />} 
            label="AI Insights" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </Box>

      {/* AI Insights Overview */}
      {aiInsights && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ mr: 2, fontSize: 30 }} />
              <Typography variant="h6">AI Performance Insights</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.performance_score || 85}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Performance Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.placement_probability || 85}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Placement Probability
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.rank_percentile || 75}th
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Percentile Rank
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
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
                {analyticsData?.success_rate || mockData.success_rate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
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
                <Schedule sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {analyticsData?.average_response_time || mockData.average_response_time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time (days)
              </Typography>
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
                <TrendingUp sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {analyticsData?.placement_probability || mockData.placement_probability}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placement Probability
              </Typography>
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
                <Leaderboard sx={{ color: 'white', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                #{analyticsData?.rank || 15}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department Rank
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different analytics views */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Application Trends" />
            <Tab label="Skills Analysis" />
            <Tab label="Industry Breakdown" />
            <Tab label="AI Predictions" />
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Application Trends Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={analyticsData?.application_trends || mockData.application_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="interviews" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="placements" stroke="#ffc658" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Quick Stats
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Total Applications"
                      secondary={analyticsData?.total_applications || 22}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Interviews Scheduled"
                      secondary={analyticsData?.interviews_scheduled || 8}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <School color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Placements"
                      secondary={analyticsData?.placements || 5}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Top Performing Skills
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={mockData.top_performing_skills.map(skill => ({ skill, match: Math.random() * 100 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="match" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Skill Recommendations
                </Typography>
                <List>
                  {['Machine Learning', 'Cloud Computing', 'DevOps', 'React Native'].map((skill, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Star color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={skill} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Industry Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={analyticsData?.industry_breakdown || mockData.industry_breakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {(analyticsData?.industry_breakdown || mockData.industry_breakdown).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Industry Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Business color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Software Development"
                      secondary="45% of applications"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data Science"
                      secondary="25% of applications"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  AI-Powered Predictions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {predictions?.next_month_applications || 25}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Predicted Applications (Next Month)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {predictions?.interview_rate || 72}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Predicted Interview Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {predictions?.placement_timeline || '3-4 months'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Time to Placement
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* AI Recommendations */}
      {aiInsights?.recommendations && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToy sx={{ mr: 2, color: '#9c27b0' }} />
              <Typography variant="h6">AI Recommendations</Typography>
            </Box>
            <List>
              {aiInsights.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Insights color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AnalyticsPage;