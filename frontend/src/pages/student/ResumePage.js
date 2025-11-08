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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Description,
  CloudUpload,
  Download,
  Edit,
  Delete,
  CheckCircle,
  SmartToy,
  Psychology,
  Timeline,
  FileCopy,
  PictureAsPdf,
  Assessment,
  Work,
  School,
  Star,
  StarBorder,
  Visibility,
  Share,
  ExpandMore,
  UploadFile
} from '@mui/icons-material';
import { useAuth } from '../../services/authService';
import BackButton from '../../components/BackButton';

const ResumePage = () => {
  const { token } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [resumeVersions, setResumeVersions] = useState([]);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      // Fetch current resume data
      const response = await fetch('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(data.profile);
        
        // Get AI resume analysis
        await getAIResumeAnalysis(data.profile);
        await getAISuggestions();
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAIResumeAnalysis = async (profile) => {
    try {
      const response = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_data: profile
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error fetching AI resume analysis:', error);
    }
  };

  const getAISuggestions = async () => {
    try {
      const response = await fetch('/api/student/resume-suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_role: targetRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      setUploadProgress(0);
      setLoading(true);

      const response = await fetch('/api/student/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(prev => ({ ...prev, resume_file: data.file_info.filename }));
        setUploadDialog(false);
        setSelectedFile(null);
        
        // Refresh AI analysis after upload
        await getAIResumeAnalysis(resumeData);
        await getAISuggestions();
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const calculateResumeScore = () => {
    if (!aiAnalysis) return 0;
    return Math.round(aiAnalysis.overall_score || 0);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading && !resumeData) {
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
          Resume Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            icon={<SmartToy />} 
            label="AI Optimized" 
            color="secondary" 
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Resume
          </Button>
        </Box>
      </Box>

      {/* Resume Score and AI Analysis */}
      {aiAnalysis && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}>
                  {calculateResumeScore()}%
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  AI Resume Score
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {getScoreText(calculateResumeScore())}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Psychology sx={{ mr: 2, color: '#9c27b0' }} />
                  <Typography variant="h6">AI Resume Analysis</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {aiAnalysis.ats_score || 85}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ATS Compatibility
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {aiAnalysis.formatting_score || 92}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Formatting Score
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Main Resume Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Current Resume</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary">
                    <Download />
                  </IconButton>
                  <IconButton color="primary">
                    <Share />
                  </IconButton>
                </Box>
              </Box>
              
              {resumeData?.resume_file ? (
                <Paper sx={{ p: 3, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                  <PictureAsPdf sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {resumeData.resume_file}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Last updated: {new Date().toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download
                    </Button>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Delete />}>
                      Delete
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa' }}>
                  <Description sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    No resume uploaded yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => setUploadDialog(true)}
                  >
                    Upload Your Resume
                  </Button>
                </Paper>
              )}
            </CardContent>
          </Card>

          {/* Resume Building Process */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Resume Building Process
              </Typography>
              <Stepper orientation="vertical">
                <Step completed>
                  <StepLabel
                    StepIconComponent={() => <CheckCircle color="success" />}
                  >
                    Basic Information Uploaded
                  </StepLabel>
                </Step>
                <Step completed={Boolean(resumeData?.education?.length)}>
                  <StepLabel
                    StepIconComponent={() => 
                      resumeData?.education?.length ? <CheckCircle color="success" /> : <School />
                    }
                  >
                    Education Details Added
                  </StepLabel>
                </Step>
                <Step completed={Boolean(resumeData?.experience?.length)}>
                  <StepLabel
                    StepIconComponent={() => 
                      resumeData?.experience?.length ? <CheckCircle color="success" /> : <Work />
                    }
                  >
                    Work Experience Added
                  </StepLabel>
                </Step>
                <Step completed={Boolean(resumeData?.skills?.length)}>
                  <StepLabel
                    StepIconComponent={() => 
                      resumeData?.skills?.length ? <CheckCircle color="success" /> : <Assessment />
                    }
                  >
                    Skills Section Completed
                  </StepLabel>
                </Step>
                <Step completed={Boolean(resumeData?.resume_file)}>
                  <StepLabel
                    StepIconComponent={() => 
                      resumeData?.resume_file ? <CheckCircle color="success" /> : <Description />
                    }
                  >
                    Resume Uploaded
                  </StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* AI Suggestions */}
          {aiSuggestions && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SmartToy sx={{ mr: 2, color: '#9c27b0' }} />
                  <Typography variant="h6">AI Recommendations</Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Target Role</InputLabel>
                  <Select
                    value={targetRole}
                    label="Target Role"
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      getAISuggestions();
                    }}
                  >
                    <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                    <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                    <MenuItem value="Web Developer">Web Developer</MenuItem>
                    <MenuItem value="Machine Learning Engineer">ML Engineer</MenuItem>
                    <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                  </Select>
                </FormControl>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Suggested Skills</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {aiSuggestions.suggested_skills?.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          color="primary" 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Improvement Areas</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {aiSuggestions.improvement_areas?.map((area, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Star color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Resume Stats
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Download Count"
                    secondary="24 times"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="View Count"
                    secondary="156 views"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Last Updated"
                    secondary="2 days ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Format"
                    secondary="PDF"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Resume</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="resume-upload"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <label htmlFor="resume-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFile />}
                fullWidth
                sx={{ mb: 2, p: 3 }}
              >
                {selectedFile ? selectedFile.name : 'Select Resume File'}
              </Button>
            </label>
            
            {selectedFile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Alert>
            )}
          </Box>
          
          {uploadProgress > 0 && (
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ mb: 2 }} 
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleFileUpload}
            disabled={!selectedFile || loading}
          >
            Upload Resume
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResumePage;