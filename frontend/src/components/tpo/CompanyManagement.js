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
  Divider
} from '@mui/material';
import {
  Business,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Add,
  Edit,
  Refresh,
  Visibility,
  Timeline
} from '@mui/icons-material';
// import { tpoService } from '../../services/tpoService'; // Temporarily disabled to avoid API calls

const CompanyManagement = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    website: '',
    contact_person: '',
    contact_email: '',
    contact_phone: ''
  });
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState(null);
  const [selectedCompanyForDelete, setSelectedCompanyForDelete] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCompanyForView, setSelectedCompanyForView] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data instead of API calls
      setInsights({
        insights: {
          engagement_score: 85,
          placement_probability: 78,
          key_insights: [
            'Strong partnership with leading tech companies',
            'Consistent placement record over the years',
            'Good industry connections and networking'
          ],
          action_items: [
            'Schedule follow-up meetings',
            'Update contact information',
            'Request feedback on recent drives'
          ],
          key_metrics: {
            response_time: '2 days average',
            participation_rate: '85%',
            success_rate: '72%'
          }
        }
      });

      setCompanies([
        {
          id: 1,
          name: 'Google',
          industry: 'Technology',
          website: 'google.com',
          contact_person: 'John Smith',
          contact_email: 'john@google.com'
        },
        {
          id: 2,
          name: 'Microsoft',
          industry: 'Technology',
          website: 'microsoft.com',
          contact_person: 'Jane Doe',
          contact_email: 'jane@microsoft.com'
        },
        {
          id: 3,
          name: 'Amazon',
          industry: 'E-commerce',
          website: 'amazon.com',
          contact_person: 'Bob Johnson',
          contact_email: 'bob@amazon.com'
        }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyDetails = async (companyId) => {
    try {
      // Use mock data instead of API call
      setSelectedCompany({
        insights: {
          engagement_score: 90,
          placement_probability: 85,
          key_insights: [
            'Excellent track record with this company',
            'Strong technical requirements match',
            'Good salary packages offered'
          ]
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCompany = async () => {
    try {
      // Mock company creation instead of API call
      console.log('Creating company:', newCompany);
      setDialogOpen(false);
      setNewCompany({
        name: '',
        industry: '',
        website: '',
        contact_person: '',
        contact_email: '',
        contact_phone: ''
      });
      loadData(); // Reload data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompanyForEdit(company);
    setEditDialog(true);
  };

  const handleDeleteCompany = (company) => {
    setSelectedCompanyForDelete(company);
    setDeleteDialog(true);
  };

  const handleViewCompany = (company) => {
    setSelectedCompanyForView(company);
    setViewDialog(true);
  };

  const confirmEditCompany = async () => {
    try {
      console.log('Editing company:', selectedCompanyForEdit);
      setEditDialog(false);
      setSelectedCompanyForEdit(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDeleteCompany = async () => {
    try {
      console.log('Deleting company:', selectedCompanyForDelete);
      setDeleteDialog(false);
      setSelectedCompanyForDelete(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Company Data...</Typography>
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
          Company Management
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
            Add Company
          </Button>
        </Box>
      </Box>

      {/* AI Insights Section */}
      {insights && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card className="animated-card">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  AI-Powered Company Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <TrendingUp color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6">Engagement Score</Typography>
                      </Box>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {insights.insights?.engagement_score || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High engagement with partner companies
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, background: 'rgba(33, 150, 243, 0.1)', borderRadius: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CheckCircle color="info" sx={{ mr: 1 }} />
                        <Typography variant="h6">Placement Probability</Typography>
                      </Box>
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {insights.insights?.placement_probability || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expected placement success rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Key Insights */}
                {insights.insights?.key_insights && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Key Insights</Typography>
                    <List>
                      {insights.insights.key_insights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Business color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={insight} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Action Items */}
                {insights.insights?.action_items && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Action Items</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {insights.insights.action_items.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          color="primary"
                          variant="outlined"
                          icon={<Timeline />}
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
                <Typography variant="h6" gutterBottom>Company Performance</Typography>
                
                {insights.insights?.key_metrics && (
                  <Box>
                    {Object.entries(insights.insights.key_metrics).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Companies List */}
      <Card className="animated-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Company Directory
          </Typography>
          
          <List>
            {companies.map((company) => (
              <React.Fragment key={company.id}>
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
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={company.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {company.industry} • {company.website}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Chip
                            size="small"
                            label="Active"
                            color="success"
                            icon={<CheckCircle />}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Contact: {company.contact_person} ({company.contact_email})
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton
                    onClick={() => handleViewCompany(company)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditCompany(company)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Add Company Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Company Name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              fullWidth
              required
            />
            <TextField
              label="Industry"
              value={newCompany.industry}
              onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
              fullWidth
            />
            <TextField
              label="Website"
              value={newCompany.website}
              onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
              fullWidth
            />
            <TextField
              label="Contact Person"
              value={newCompany.contact_person}
              onChange={(e) => setNewCompany({...newCompany, contact_person: e.target.value})}
              fullWidth
            />
            <TextField
              label="Contact Email"
              type="email"
              value={newCompany.contact_email}
              onChange={(e) => setNewCompany({...newCompany, contact_email: e.target.value})}
              fullWidth
            />
            <TextField
              label="Contact Phone"
              value={newCompany.contact_phone}
              onChange={(e) => setNewCompany({...newCompany, contact_phone: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCompany} variant="contained">
            Add Company
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Business sx={{ mr: 1 }} />
            Company Details: {selectedCompanyForView?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCompanyForView && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography><strong>Name:</strong> {selectedCompanyForView.name}</Typography>
                      <Typography><strong>Industry:</strong> {selectedCompanyForView.industry}</Typography>
                      <Typography><strong>Website:</strong> {selectedCompanyForView.website}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography><strong>Contact Person:</strong> {selectedCompanyForView.contact_person}</Typography>
                      <Typography><strong>Email:</strong> {selectedCompanyForView.contact_email}</Typography>
                      <Typography><strong>Phone:</strong> {selectedCompanyForView.contact_phone || 'Not provided'}</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
          <Button onClick={() => { setViewDialog(false); handleEditCompany(selectedCompanyForView); }} variant="outlined">
            Edit Company
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          {selectedCompanyForEdit && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Company Name"
                value={selectedCompanyForEdit.name}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, name: e.target.value})}
                fullWidth
                required
              />
              <TextField
                label="Industry"
                value={selectedCompanyForEdit.industry}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, industry: e.target.value})}
                fullWidth
              />
              <TextField
                label="Website"
                value={selectedCompanyForEdit.website}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, website: e.target.value})}
                fullWidth
              />
              <TextField
                label="Contact Person"
                value={selectedCompanyForEdit.contact_person}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, contact_person: e.target.value})}
                fullWidth
              />
              <TextField
                label="Contact Email"
                type="email"
                value={selectedCompanyForEdit.contact_email}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, contact_email: e.target.value})}
                fullWidth
              />
              <TextField
                label="Contact Phone"
                value={selectedCompanyForEdit.contact_phone}
                onChange={(e) => setSelectedCompanyForEdit({...selectedCompanyForEdit, contact_phone: e.target.value})}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={confirmEditCompany} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Company Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Warning color="warning" sx={{ mr: 1 }} />
            Delete Company
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCompanyForDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. All associated placement drives and applications will be affected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCompany} color="error" variant="contained">
            Delete Company
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyManagement;