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
  Badge,
  Tooltip,
  Fab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Avatar
} from '@mui/material';
import {
  School,
  Business,
  TrendingUp,
  FilterList,
  Search,
  SmartToy,
  Assessment,
  Schedule,
  LocationOn,
  AttachMoney,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  Psychology,
  Timeline,
  CheckCircle,
  Schedule as ScheduleIcon,
  Group
} from '@mui/icons-material';
import { useAuth } from '../../services/authService';
import BackButton from '../../components/BackButton';

const PlacementDrivesPage = () => {
  const { token } = useAuth();
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCGPA, setFilterCGPA] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [jobFitScores, setJobFitScores] = useState({});
  const [favoriteDrives, setFavoriteDrives] = useState(new Set());
  const [appliedDrives, setAppliedDrives] = useState(new Set());

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    filterDrives();
  }, [drives, searchTerm, filterCGPA, filterCompany]);

  const fetchDrives = async () => {
    try {
      const response = await fetch('/api/student/available-drives', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrives(data.drives);
        
        // Get AI recommendations and job fit scores
        await getAIRecommendations(data.drives);
      }
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendations = async (drivesData) => {
    try {
      // Calculate AI job fit scores for each drive
      for (const drive of drivesData) {
        const response = await fetch('/api/ai/job-fit-score', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            student_skills: ['JavaScript', 'Python', 'React', 'Node.js'],
            job_requirements: drive.required_skills || [],
            student_cgpa: 8.5,
            min_cgpa: drive.min_cgpa || 0
          })
        });

        if (response.ok) {
          const data = await response.json();
          setJobFitScores(prev => ({
            ...prev,
            [drive.id]: data.ai_score
          }));
        }
      }

      // Get general AI recommendations
      const recResponse = await fetch('/api/ai/placement-recommendations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          drives: drivesData
        })
      });

      if (recResponse.ok) {
        const recData = await recResponse.json();
        setAiRecommendations(recData.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    }
  };

  const filterDrives = () => {
    let filtered = drives;

    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.job_role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCGPA) {
      filtered = filtered.filter(drive => 
        !drive.min_cgpa || drive.min_cgpa <= parseFloat(filterCGPA)
      );
    }

    if (filterCompany) {
      filtered = filtered.filter(drive => 
        drive.company?.name?.toLowerCase().includes(filterCompany.toLowerCase())
      );
    }

    setFilteredDrives(filtered);
  };

  const handleApplyDrive = async (driveId) => {
    try {
      const response = await fetch('/api/student/apply-drive', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drive_id: driveId })
      });

      if (response.ok) {
        setAppliedDrives(prev => new Set([...prev, driveId]));
        // Show success message
      }
    } catch (error) {
      console.error('Error applying to drive:', error);
    }
  };

  const toggleFavorite = (driveId) => {
    setFavoriteDrives(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(driveId)) {
        newFavorites.delete(driveId);
      } else {
        newFavorites.add(driveId);
      }
      return newFavorites;
    });
  };

  const getJobFitColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getJobFitText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
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
          Placement Drives
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            icon={<SmartToy />} 
            label={`${aiRecommendations.length} AI Recommendations`} 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={`${drives.length} Available Drives`} 
            color="primary"
          />
        </Box>
      </Box>

      {/* AI Recommendations Alert */}
      {aiRecommendations.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }} icon={<SmartToy />}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>AI-Powered Recommendations:</Typography>
          <Typography variant="body2">
            Based on your profile, we recommend {aiRecommendations.slice(0, 3).join(', ')} drives for better placement chances.
          </Typography>
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search companies, roles, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Min CGPA"
                type="number"
                value={filterCGPA}
                onChange={(e) => setFilterCGPA(e.target.value)}
                placeholder="e.g., 7.0"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Company"
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                placeholder="Filter by company"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setFilterCGPA('');
                  setFilterCompany('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Drives Grid */}
      <Grid container spacing={3}>
        {filteredDrives.map((drive) => {
          const jobFitScore = jobFitScores[drive.id];
          const isFavorite = favoriteDrives.has(drive.id);
          const isApplied = appliedDrives.has(drive.id);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={drive.id}>
              <Card className="animated-card" sx={{ 
                height: '100%',
                position: 'relative',
                border: isFavorite ? '2px solid #e91e63' : 'none'
              }}>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        mr: 2,
                        width: 40,
                        height: 40 
                      }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {drive.company?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {drive.title}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      onClick={() => toggleFavorite(drive.id)}
                      color={isFavorite ? 'error' : 'default'}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>

                  {/* Job Role */}
                  <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
                    {drive.job_role}
                  </Typography>

                  {/* AI Job Fit Score */}
                  {jobFitScore && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SmartToy sx={{ mr: 1, fontSize: 20, color: '#9c27b0' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          AI Job Fit Score
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={jobFitScore.total_score}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getJobFitColor(jobFitScore.total_score)
                            }
                          }}
                        />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            ml: 1, 
                            color: getJobFitColor(jobFitScore.total_score),
                            fontWeight: 'bold'
                          }}
                        >
                          {Math.round(jobFitScore.total_score)}%
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: getJobFitColor(jobFitScore.total_score),
                          fontWeight: 'bold'
                        }}
                      >
                        {getJobFitText(jobFitScore.total_score)}
                      </Typography>
                    </Box>
                  )}

                  {/* Drive Details */}
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Application Deadline"
                        secondary={new Date(drive.application_deadline).toLocaleDateString()}
                      />
                    </ListItem>
                    {drive.min_cgpa && (
                      <ListItem>
                        <ListItemIcon>
                          <Assessment fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Min CGPA"
                          secondary={drive.min_cgpa}
                        />
                      </ListItem>
                    )}
                    {drive.salary_range && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Salary Range"
                          secondary={drive.salary_range}
                        />
                      </ListItem>
                    )}
                    {drive.location && (
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Location"
                          secondary={drive.location}
                        />
                      </ListItem>
                    )}
                  </List>

                  {/* Required Skills */}
                  {drive.required_skills && drive.required_skills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {drive.required_skills.slice(0, 3).map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                        {drive.required_skills.length > 3 && (
                          <Chip 
                            label={`+${drive.required_skills.length - 3} more`} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Eligibility Status */}
                  <Box sx={{ mb: 2 }}>
                    {drive.eligible ? (
                      <Chip 
                        label="Eligible" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                      />
                    ) : (
                      <Chip 
                        label={drive.ineligibility_reason || 'Not Eligible'} 
                        color="error" 
                        size="small"
                      />
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={!drive.eligible || isApplied}
                      onClick={() => handleApplyDrive(drive.id)}
                    >
                      {isApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedDrive(drive)}
                    >
                      Details
                    </Button>
                  </Box>

                  {/* AI Match Indicators */}
                  {jobFitScore && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Match: {jobFitScore.matched_skills?.length || 0} skills • 
                        {jobFitScore.missing_skills?.length || 0} gaps
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredDrives.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No placement drives found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search filters or check back later for new opportunities
          </Typography>
        </Box>
      )}

      {/* Drive Details Dialog */}
      <Dialog
        open={Boolean(selectedDrive)}
        onClose={() => setSelectedDrive(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedDrive && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 2 }} />
                {selectedDrive.company?.name} - {selectedDrive.job_role}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Job Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedDrive.description || 'Detailed job description will be available soon.'}
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Requirements
                  </Typography>
                  <List>
                    {selectedDrive.required_skills?.map((skill, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Drive Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Application Deadline"
                          secondary={new Date(selectedDrive.application_deadline).toLocaleDateString()}
                        />
                      </ListItem>
                      {selectedDrive.min_cgpa && (
                        <ListItem>
                          <ListItemText 
                            primary="Minimum CGPA"
                            secondary={selectedDrive.min_cgpa}
                          />
                        </ListItem>
                      )}
                      {selectedDrive.interview_date && (
                        <ListItem>
                          <ListItemText 
                            primary="Interview Date"
                            secondary={new Date(selectedDrive.interview_date).toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                      {selectedDrive.location && (
                        <ListItem>
                          <ListItemText 
                            primary="Location"
                            secondary={selectedDrive.location}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedDrive(null)}>Close</Button>
              <Button 
                variant="contained"
                disabled={!selectedDrive.eligible}
                onClick={() => {
                  handleApplyDrive(selectedDrive.id);
                  setSelectedDrive(null);
                }}
              >
                Apply Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default PlacementDrivesPage;