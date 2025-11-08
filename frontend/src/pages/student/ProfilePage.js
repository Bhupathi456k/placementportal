import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit,
  Save,
  CloudUpload,
  Psychology,
  Timeline,
  School,
  Work,
  Stars,
  SmartToy
} from '@mui/icons-material';
import { useAuth } from '../../services/authService';
import BackButton from '../../components/BackButton';

const ProfilePage = () => {
  const { token } = useAuth(); // Temporarily enabled
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchAIInsights();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setEditData(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    try {
      // Get AI-powered profile insights
      const response = await fetch('/api/ai/profile-insights', {
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
        setAiInsights(data);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setIsEditing(false);
        fetchAIInsights(); // Refresh AI insights after update
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
          target_role: 'Software Engineer'
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

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.cgpa,
      profile.phone,
      profile.resume_file,
      profile.skills,
      profile.education,
      profile.experience
    ];
    
    const completedFields = fields.filter(field => field && (Array.isArray(field) ? field.length > 0 : field.toString().trim() !== '')).length;
    return Math.round((completedFields / fields.length) * 100);
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
          Profile Management
        </Typography>
        <Button
          variant={isEditing ? "contained" : "outlined"}
          startIcon={isEditing ? <Save /> : <Edit />}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          sx={{ borderRadius: 2 }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      {/* AI Insights Card */}
      {aiInsights && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToy sx={{ mr: 2, fontSize: 30 }} />
              <Typography variant="h6">AI Profile Insights</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {aiInsights.insights?.summary || 'AI is analyzing your profile for optimization opportunities...'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Profile Completion */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Stars sx={{ mr: 2, color: '#4caf50' }} />
            <Typography variant="h6">Profile Completion</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateProfileCompletion()} 
            sx={{ mb: 2, height: 10, borderRadius: 5 }}
            color={calculateProfileCompletion() >= 80 ? 'success' : calculateProfileCompletion() >= 60 ? 'warning' : 'error'}
          />
          <Typography variant="body2" color="text.secondary">
            {calculateProfileCompletion()}% Complete - {calculateProfileCompletion() >= 80 ? 'Excellent!' : 'Keep improving your profile'}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Basic Info" />
                <Tab label="Education" />
                <Tab label="Experience" />
                <Tab label="Skills" />
              </Tabs>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={isEditing ? editData.first_name || '' : profile?.first_name || ''}
                      onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "standard"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={isEditing ? editData.last_name || '' : profile?.last_name || ''}
                      onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "standard"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CGPA"
                      type="number"
                      value={isEditing ? editData.cgpa || '' : profile?.cgpa || ''}
                      onChange={(e) => setEditData({...editData, cgpa: e.target.value})}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "standard"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={isEditing ? editData.phone || '' : profile?.phone || ''}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "standard"}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={3}
                      value={isEditing ? editData.address || '' : profile?.address || ''}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "standard"}
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Education</Typography>
                    {isEditing && (
                      <Button size="small" variant="outlined">Add Education</Button>
                    )}
                  </Box>
                  <List>
                    {(profile?.education || []).map((edu, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={edu.degree}
                          secondary={`${edu.institution} - ${edu.year} (CGPA: ${edu.cgpa})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Experience</Typography>
                    {isEditing && (
                      <Button size="small" variant="outlined">Add Experience</Button>
                    )}
                  </Box>
                  <List>
                    {(profile?.experience || []).map((exp, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={exp.position}
                          secondary={`${exp.company} - ${exp.duration}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activeTab === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Skills</Typography>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<Psychology />}
                      onClick={getAISuggestions}
                    >
                      Get AI Suggestions
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(profile?.skills || []).map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  {aiSuggestions && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>AI Skill Suggestions:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {aiSuggestions.suggested_skills?.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            color="secondary" 
                            size="small"
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Profile Photo Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '48px'
                }}
              >
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </Avatar>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                component="label"
                size="small"
              >
                Upload Photo
                <input type="file" hidden accept="image/*" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ mr: 2, color: '#9c27b0' }} />
                <Typography variant="h6">AI Recommendations</Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Optimize Skills" 
                    secondary="Add machine learning skills for better placement"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Update Projects" 
                    secondary="Add recent web development projects"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Improve CGPA" 
                    secondary="Target CGPA of 8.5+ for better opportunities"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;