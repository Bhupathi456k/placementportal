import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import {
  Notifications,
  Security,
  AccountCircle,
  Email,
  School,
  Business,
  Save,
  Edit,
  Visibility,
  VisibilityOff,
  Download,
  Upload,
  Backup
} from '@mui/icons-material';
import BackButton from '../components/BackButton';

const SettingsPage = ({ userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // Profile Settings
    profile: {
      name: userRole === 'student' ? 'John Doe' : 
            userRole === 'hod' ? 'Dr. Sarah Johnson' : 'Mr. Robert Anderson',
      email: userRole === 'student' ? 'john.doe@college.edu' :
             userRole === 'hod' ? 'sarah.johnson@college.edu' : 'robert.anderson@college.edu',
      phone: '+91 9876543210',
      department: userRole === 'student' ? 'Computer Science' :
                  userRole === 'hod' ? 'Computer Science' : 'TPO Office',
      year: userRole === 'student' ? 'Final Year' : '',
      specialization: userRole === 'student' ? 'Software Engineering' : ''
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      placementUpdates: true,
      driveReminders: true,
      resultAlerts: true,
      systemUpdates: false,
      marketingEmails: false
    },
    // Privacy Settings
    privacy: {
      profileVisibility: 'department',
      showCGPA: true,
      showResume: true,
      allowDirectContact: false,
      dataSharing: false
    },
    // Theme Settings
    theme: {
      mode: 'light',
      colorScheme: 'blue',
      fontSize: 'medium',
      compactMode: false
    },
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordChange: false
    },
    // General Preferences
    general: {
      language: 'english',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12hour',
      autoSave: true,
      compactView: false
    }
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Settings saved:', settings);
    // Show success message
  };

  const handlePasswordChange = () => {
    console.log('Password changed');
    setPasswordDialog(false);
    setNewPassword('');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'user_settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const roleSpecificFields = {
    student: [
      { key: 'year', label: 'Academic Year', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', 'Final Year'] },
      { key: 'specialization', label: 'Specialization', type: 'text' }
    ],
    hod: [
      { key: 'qualification', label: 'Qualification', type: 'text', default: 'PhD in Computer Science' },
      { key: 'experience', label: 'Experience', type: 'text', default: '15 years' }
    ],
    tpo: [
      { key: 'office', label: 'Office Location', type: 'text', default: 'Main Campus' },
      { key: 'extension', label: 'Extension', type: 'text', default: '1234' }
    ]
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'student': return '#667eea';
      case 'hod': return '#ff9800';
      case 'tpo': return '#9c27b0';
      default: return '#1976d2';
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'student': return 'Student';
      case 'hod': return 'Head of Department';
      case 'tpo': return 'Training & Placement Officer';
      default: return 'User';
    }
  };

  const tabLabels = ['Profile', 'Notifications', 'Privacy', 'Theme', 'Security', 'General'];

  const renderProfileSettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: getRoleColor(),
            fontSize: '32px',
            mr: 2
          }}>
            {settings.profile.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {settings.profile.name}
            </Typography>
            <Chip 
              label={getRoleTitle()} 
              size="small" 
              sx={{ bgcolor: getRoleColor(), color: 'white', mt: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {settings.profile.department}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={settings.profile.name}
              onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={settings.profile.email}
              onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
              margin="normal"
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.profile.phone}
              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              value={settings.profile.department}
              onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
              margin="normal"
            />
          </Grid>
          
          {roleSpecificFields[userRole]?.map(field => (
            <Grid item xs={12} sm={6} key={field.key}>
              {field.type === 'select' ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={settings.profile[field.key]}
                    onChange={(e) => handleSettingChange('profile', field.key, e.target.value)}
                  >
                    {field.options.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={settings.profile[field.key]}
                  onChange={(e) => handleSettingChange('profile', field.key, e.target.value)}
                  margin="normal"
                  defaultValue={field.default}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
            Save Profile
          </Button>
          <Button variant="outlined" startIcon={<Upload />}>
            Upload Photo
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Notification Preferences
        </Typography>
        <List>
          {[
            { key: 'emailNotifications', label: 'Email Notifications', icon: <Email /> },
            { key: 'pushNotifications', label: 'Push Notifications', icon: <Notifications /> },
            { key: 'placementUpdates', label: 'Placement Updates', icon: <School /> },
            { key: 'driveReminders', label: 'Drive Reminders', icon: <Notifications /> },
            { key: 'resultAlerts', label: 'Result Alerts', icon: <School /> },
            { key: 'systemUpdates', label: 'System Updates', icon: <Business /> },
            { key: 'marketingEmails', label: 'Marketing Emails', icon: <Email /> }
          ].map(item => (
            <ListItem key={item.key}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications[item.key]}
                  onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Privacy & Visibility
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Profile Visibility</InputLabel>
              <Select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="department">Department Only</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <List>
          {[
            { key: 'showCGPA', label: 'Show CGPA in Profile' },
            { key: 'showResume', label: 'Allow Resume Download' },
            { key: 'allowDirectContact', label: 'Allow Direct Contact' },
            { key: 'dataSharing', label: 'Share Data for Analytics' }
          ].map(item => (
            <ListItem key={item.key}>
              <ListItemText primary={item.label} />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.privacy[item.key]}
                  onChange={(e) => handleSettingChange('privacy', item.key, e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderThemeSettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Appearance & Theme
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Color Scheme</InputLabel>
              <Select
                value={settings.theme.colorScheme}
                onChange={(e) => handleSettingChange('theme', 'colorScheme', e.target.value)}
              >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="purple">Purple</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
                <MenuItem value="red">Red</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Font Size</InputLabel>
              <Select
                value={settings.theme.fontSize}
                onChange={(e) => handleSettingChange('theme', 'fontSize', e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <List>
          <ListItem>
            <ListItemText primary="Dark Mode" />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.theme.mode === 'dark'}
                onChange={(e) => handleSettingChange('theme', 'mode', e.target.checked ? 'dark' : 'light')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Compact Mode" />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.theme.compactMode}
                onChange={(e) => handleSettingChange('theme', 'compactMode', e.target.checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Security & Privacy
        </Typography>
        <List>
          {[
            { key: 'twoFactorAuth', label: 'Two-Factor Authentication' },
            { key: 'loginAlerts', label: 'Login Alerts' },
            { key: 'passwordChange', label: 'Password Expiry Reminder' }
          ].map(item => (
            <ListItem key={item.key}>
              <ListItemIcon><Security /></ListItemIcon>
              <ListItemText primary={item.label} />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.security[item.key]}
                  onChange={(e) => handleSettingChange('security', item.key, e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Session Timeout (minutes)</InputLabel>
          <Select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
          >
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={120}>2 hours</MenuItem>
            <MenuItem value={480}>8 hours</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<Edit />} onClick={() => setPasswordDialog(true)}>
            Change Password
          </Button>
          <Button variant="outlined" startIcon={<Backup />}>
            Download My Data
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderGeneralSettings = () => (
    <Card className="animated-card">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          General Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.general.language}
                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="hindi">Hindi</MenuItem>
                <MenuItem value="marathi">Marathi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Date Format</InputLabel>
              <Select
                value={settings.general.dateFormat}
                onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Time Format</InputLabel>
              <Select
                value={settings.general.timeFormat}
                onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
              >
                <MenuItem value="12hour">12 Hour</MenuItem>
                <MenuItem value="24hour">24 Hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <List>
          {[
            { key: 'autoSave', label: 'Auto-save Changes' },
            { key: 'compactView', label: 'Compact View by Default' }
          ].map(item => (
            <ListItem key={item.key}>
              <ListItemText primary={item.label} />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.general[item.key]}
                  onChange={(e) => handleSettingChange('general', item.key, e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderProfileSettings();
      case 1: return renderNotificationSettings();
      case 2: return renderPrivacySettings();
      case 3: return renderThemeSettings();
      case 4: return renderSecuritySettings();
      case 5: return renderGeneralSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="glass-card" style={{ minHeight: '100vh', position: 'relative' }}>
      <BackButton />
      {/* Header */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${getRoleColor()} 0%, ${getRoleColor()}dd 100%)`,
        color: 'white',
        p: 3,
        borderRadius: '0 0 20px 20px',
        mb: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountCircle sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Settings
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Manage your account preferences and privacy
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={handleExportData}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Export Data
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Save All
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card className="animated-card">
              <CardContent sx={{ p: 0 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  orientation="vertical"
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      minHeight: 60
                    }
                  }}
                >
                  {tabLabels.map((label, index) => (
                    <Tab key={index} label={label} />
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Your settings are automatically saved. Changes will take effect immediately.
            </Alert>
            {renderTabContent()}
          </Grid>
        </Grid>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete your account? This will remove all your data including:
          </Typography>
          <ul>
            <li>Profile information</li>
            <li>Application history</li>
            <li>Saved preferences</li>
            <li>All associated data</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={() => {/* handle account deletion */}} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage;