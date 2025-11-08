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
  List,
  ListItem,
  ListItemText,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  TrendingUp,
  ExpandMore,
  Assessment,
  SmartToy
} from '@mui/icons-material';
import BackButton from '../../components/BackButton';

const ResultsPage = () => {
  // const { token } = useAuth(); // Temporarily disabled
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      // Mock data for demonstration
      const mockResults = [
        {
          id: 1,
          company: 'Google',
          position: 'Software Engineer',
          rounds: [
            { name: 'Technical Round 1', status: 'passed', score: 85 },
            { name: 'Technical Round 2', status: 'passed', score: 78 },
            { name: 'HR Round', status: 'pending', score: null }
          ],
          overall_status: 'in_progress',
          ai_feedback: 'Strong technical skills demonstrated. Continue preparation for HR round.'
        },
        {
          id: 2,
          company: 'Microsoft',
          position: 'Product Manager',
          rounds: [
            { name: 'Aptitude Test', status: 'passed', score: 90 },
            { name: 'Technical Interview', status: 'failed', score: 45 }
          ],
          overall_status: 'rejected',
          ai_feedback: 'Aptitude test performance was excellent. Technical interview needs more preparation in system design.'
        },
        {
          id: 3,
          company: 'Amazon',
          position: 'Data Scientist',
          rounds: [
            { name: 'Online Assessment', status: 'passed', score: 88 },
            { name: 'Technical Interview', status: 'passed', score: 82 },
            { name: 'Bar Raiser', status: 'passed', score: 75 }
          ],
          overall_status: 'placed',
          ai_feedback: 'Excellent performance across all rounds. Ready for offer processing.'
        }
      ];

      setResults(mockResults);
      
      // Generate AI insights
      const insights = {
        success_rate: 75,
        avg_score: Math.round(mockResults.reduce((acc, r) => {
          const validScores = r.rounds.filter(round => round.score !== null).map(round => round.score);
          return acc + (validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0);
        }, 0) / mockResults.length),
        recommendations: [
          'Focus on system design concepts for better performance',
          'Practice behavioral questions for HR rounds',
          'Continue strengthening technical fundamentals'
        ],
        strength_areas: ['Problem Solving', 'Aptitude', 'Data Structures'],
        improvement_areas: ['System Design', 'Behavioral Questions']
      };
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle color="success" />;
      case 'failed': return <Cancel color="error" />;
      case 'pending': return <HourglassEmpty color="warning" />;
      default: return <Schedule color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  const getOverallStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'success';
      case 'rejected': return 'error';
      case 'in_progress': return 'warning';
      default: return 'info';
    }
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
          Interview Results & Feedback
        </Typography>
        <Chip 
          icon={<SmartToy />} 
          label={`${results.length} Interviews`} 
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* AI Insights Card */}
      {aiInsights && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToy sx={{ mr: 2, fontSize: 30 }} />
              <Typography variant="h6">AI Performance Analysis</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.success_rate}%
                  </Typography>
                  <Typography variant="body2">Success Rate</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {aiInsights.avg_score}
                  </Typography>
                  <Typography variant="body2">Average Score</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>AI Recommendations:</Typography>
                {aiInsights.recommendations.map((rec, index) => (
                  <Typography key={index} variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    • {rec}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Results List */}
      {results.map((result) => (
        <Card key={result.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {result.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.position}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={result.overall_status.replace('_', ' ').toUpperCase()} 
                color={getOverallStatusColor(result.overall_status)}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Rounds */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Interview Rounds
            </Typography>
            
            {result.rounds.map((round, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(round.status)}
                      <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                        {round.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {round.score !== null && (
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {round.score}%
                        </Typography>
                      )}
                      <Chip 
                        label={round.status} 
                        color={getStatusColor(round.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ ml: 4 }}>
                    {round.score !== null ? (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Performance Score
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={round.score} 
                          sx={{ height: 8, borderRadius: 4 }}
                          color={round.score >= 70 ? 'success' : round.score >= 50 ? 'warning' : 'error'}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                          {round.score >= 70 ? 'Excellent performance!' : 
                           round.score >= 50 ? 'Good performance, room for improvement' : 
                           'Needs significant improvement'}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Round not yet completed
                      </Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* AI Feedback */}
            {result.ai_feedback && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SmartToy sx={{ mr: 1, color: '#9c27b0' }} />
                  <Typography variant="h6" sx={{ color: '#9c27b0' }}>
                    AI Feedback
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {result.ai_feedback}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No interview results available yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your interview results and AI feedback will appear here once you complete interviews
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ResultsPage;