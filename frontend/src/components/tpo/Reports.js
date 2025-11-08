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
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  Analytics,
  Assessment,
  TrendingUp,
  TrendingDown,
  Refresh,
  Download,
  Print,
  Share,
  DateRange,
  Business,
  School,
  People,
  CheckCircle,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';
// import { tpoService } from '../../services/tpoService'; // Temporarily disabled to avoid API calls

const Reports = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportParams, setReportParams] = useState({
    type: 'overview',
    dateRange: 'last_6_months',
    department: '',
    company: '',
    includePredictions: true
  });

  useEffect(() => {
    loadReport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data instead of API call
      setReport({
        report: {
          report_summary: {
            total_placements: 125,
            success_rate: '78%',
            average_package: '$45,000',
            placement_trend: 'increasing'
          },
          detailed_analytics: {
            department_wise: {
              'Computer Science': { placed: 45, success_rate: '85%' },
              'Electronics': { placed: 30, success_rate: '75%' },
              'Mechanical': { placed: 25, success_rate: '70%' },
              'Civil': { placed: 25, success_rate: '68%' }
            },
            company_analysis: {
              top_recruiters: ['Google', 'Microsoft', 'Amazon'],
              average_package_by_company: {
                'Google': '$65,000',
                'Microsoft': '$60,000',
                'Amazon': '$55,000'
              }
            },
            skill_demand: {
              most_requested: ['Python', 'Java', 'JavaScript'],
              emerging_skills: ['AI/ML', 'Cloud Computing', 'DevOps']
            }
          },
          ai_insights: [
            'Strong placement performance this year',
            'Increasing demand for technical skills',
            'Good industry-academia collaboration'
          ],
          recommendations: [
            'Focus on emerging technology training',
            'Strengthen industry partnerships',
            'Enhance soft skills development'
          ],
          actionable_items: [
            'Organize skill development workshops',
            'Schedule more company interactions',
            'Update curriculum based on industry needs'
          ],
          future_projections: {
            next_year_target: '150 placements',
            expected_growth: '20%',
            focus_areas: ['AI/ML', 'Data Science', 'Cloud']
          }
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setDialogOpen(false);
      await loadReport();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const exportReport = (format) => {
    // In a real implementation, this would generate and download the report
    console.log(`Exporting report in ${format} format`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Generating AI Report...</Typography>
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
        <Button onClick={loadReport} startIcon={<Refresh />} variant="outlined">
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
          Comprehensive Reports
        </Typography>
        <Box>
          <Button
            onClick={() => setDialogOpen(true)}
            startIcon={<Analytics />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Generate Report
          </Button>
          <Button
            onClick={() => exportReport('pdf')}
            startIcon={<Download />}
            variant="contained"
            color="success"
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <IconButton onClick={loadReport} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* AI Report Content */}
      {report && (
        <>
          {/* Report Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card className="animated-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" display="flex" alignItems="center">
                    <Assessment sx={{ mr: 1 }} />
                    Report Summary
                  </Typography>
                  
                  {report.report?.report_summary && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {Object.entries(report.report.report_summary).map(([key, value]) => (
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

                  {/* Tabs for different report sections */}
                  <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Overview" />
                    <Tab label="Department Analysis" />
                    <Tab label="Company Performance" />
                    <Tab label="Skills Analysis" />
                    <Tab label="AI Insights" />
                  </Tabs>

                  {/* Tab Content */}
                  <Box>
                    {tabValue === 0 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Overview</Typography>
                        {report.report?.ai_insights && (
                          <List>
                            {report.report.ai_insights.map((insight, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText primary={insight} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    )}

                    {tabValue === 1 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Department Performance</Typography>
                        {report.report?.detailed_analytics?.department_wise && (
                          <TableContainer component={Paper} elevation={0}>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ background: 'rgba(0,0,0,0.04)' }}>
                                  <TableCell>Department</TableCell>
                                  <TableCell align="right">Students Placed</TableCell>
                                  <TableCell align="right">Success Rate</TableCell>
                                  <TableCell align="center">Performance</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(report.report.detailed_analytics.department_wise).map(([dept, data]) => (
                                  <TableRow key={dept}>
                                    <TableCell>
                                      <Box display="flex" alignItems="center">
                                        <School sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="body1" fontWeight="bold">
                                          {dept}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="h6" color="primary">
                                        {data.placed}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="h6" color="success.main">
                                        {data.success_rate}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <LinearProgress
                                        variant="determinate"
                                        value={parseInt(data.success_rate)}
                                        sx={{ width: 100, borderRadius: 5 }}
                                        color={parseInt(data.success_rate) >= 80 ? 'success' : 'primary'}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    )}

                    {tabValue === 2 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Company Analysis</Typography>
                        {report.report?.detailed_analytics?.company_analysis && (
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Box>
                                <Typography variant="subtitle1" gutterBottom>Top Recruiters</Typography>
                                <List>
                                  {report.report.detailed_analytics.company_analysis.top_recruiters.map((company, index) => (
                                    <ListItem key={index}>
                                      <ListItemIcon>
                                        <Business color="primary" />
                                      </ListItemIcon>
                                      <ListItemText primary={company} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box>
                                <Typography variant="subtitle1" gutterBottom>Average Packages by Company</Typography>
                                {Object.entries(report.report.detailed_analytics.company_analysis.average_package_by_company || {}).map(([company, packageValue]) => (
                                  <Box key={company} sx={{ mb: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                      <Typography variant="body2">{company}</Typography>
                                      <Typography variant="body2" fontWeight="bold" color="success.main">
                                        {packageValue}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    )}

                    {tabValue === 3 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Skills Demand Analysis</Typography>
                        {report.report?.detailed_analytics?.skill_demand && (
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                                <Typography variant="subtitle1" gutterBottom color="success.main">
                                  Most Requested Skills
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {report.report.detailed_analytics.skill_demand.most_requested?.map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      color="success"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, background: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
                                <Typography variant="subtitle1" gutterBottom color="info.main">
                                  Emerging Skills
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {report.report.detailed_analytics.skill_demand.emerging_skills?.map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      color="info"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    )}

                    {tabValue === 4 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>AI Recommendations & Future Projections</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle1" gutterBottom>Recommendations</Typography>
                              <List>
                                {report.report?.recommendations?.map((rec, index) => (
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <TrendingUp color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={rec} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle1" gutterBottom>Action Items</Typography>
                              <List>
                                {report.report?.actionable_items?.map((item, index) => (
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <CheckCircle color="success" />
                                    </ListItemIcon>
                                    <ListItemText primary={item} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        {report.report?.future_projections && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Future Projections</Typography>
                            <Grid container spacing={2}>
                              {Object.entries(report.report.future_projections).map(([key, value]) => (
                                <Grid item xs={6} sm={3} key={key}>
                                  <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(156, 39, 176, 0.1)', borderRadius: 2 }}>
                                    <Typography variant="h6" fontWeight="bold" color="secondary">
                                      {value}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {key.replace(/_/g, ' ').toUpperCase()}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Quick Actions */}
                <Card className="animated-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() => exportReport('pdf')}
                      sx={{ mb: 1 }}
                    >
                      Export as PDF
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={() => exportReport('print')}
                      sx={{ mb: 1 }}
                    >
                      Print Report
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={() => exportReport('share')}
                    >
                      Share Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Report Metadata */}
                <Card className="animated-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Report Details</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Generated on
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Report Type
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {reportParams.type.charAt(0).toUpperCase() + reportParams.type.slice(1)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time Range
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {reportParams.dateRange.replace(/_/g, ' ')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Report Type"
              value={reportParams.type}
              onChange={(e) => setReportParams({...reportParams, type: e.target.value})}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="overview">Overview</option>
              <option value="department">Department Analysis</option>
              <option value="company">Company Performance</option>
              <option value="placement">Placement Statistics</option>
              <option value="skills">Skills Analysis</option>
            </TextField>
            <TextField
              select
              label="Date Range"
              value={reportParams.dateRange}
              onChange={(e) => setReportParams({...reportParams, dateRange: e.target.value})}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="last_year">Last Year</option>
              <option value="this_year">This Year</option>
            </TextField>
            <TextField
              label="Department (Optional)"
              value={reportParams.department}
              onChange={(e) => setReportParams({...reportParams, department: e.target.value})}
              fullWidth
              placeholder="Leave empty for all departments"
            />
            <TextField
              label="Company (Optional)"
              value={reportParams.company}
              onChange={(e) => setReportParams({...reportParams, company: e.target.value})}
              fullWidth
              placeholder="Leave empty for all companies"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerateReport} variant="contained">
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports;