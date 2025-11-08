import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import HODDashboard from './pages/HODDashboard';
import TPODashboard from './pages/TPODashboard';
import StudentWelcome from './pages/redirect/StudentWelcome';
import HODWelcome from './pages/redirect/HODWelcome';
import TPOWelcome from './pages/redirect/TPOWelcome';
import SettingsPage from './pages/SettingsPage';
// Student feature pages
import ProfilePage from './pages/student/ProfilePage';
import PlacementDrivesPage from './pages/student/PlacementDrivesPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import AnalyticsPage from './pages/student/AnalyticsPage';
import ResumePage from './pages/student/ResumePage';
import ResultsPage from './pages/student/ResultsPage';
import { getToken, getUserRole } from './services/authService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    // Check authentication status
    const token = getToken();
    const role = getUserRole();
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token, role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to={`/${userRole}/welcome`} replace /> :
                <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/student/welcome"
            element={
              isAuthenticated && userRole === 'student' ?
                <StudentWelcome onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/hod/welcome"
            element={
              isAuthenticated && userRole === 'hod' ?
                <HODWelcome onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tpo/welcome"
            element={
              isAuthenticated && userRole === 'tpo' ?
                <TPOWelcome onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student"
            element={
              isAuthenticated && userRole === 'student' ?
                <StudentDashboard onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/hod"
            element={
              isAuthenticated && userRole === 'hod' ?
                <HODDashboard onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tpo"
            element={
              isAuthenticated && userRole === 'tpo' ?
                <TPODashboard onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/settings"
            element={
              isAuthenticated && userRole === 'student' ?
                <SettingsPage userRole={userRole} onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/hod/settings"
            element={
              isAuthenticated && userRole === 'hod' ?
                <SettingsPage userRole={userRole} onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tpo/settings"
            element={
              isAuthenticated && userRole === 'tpo' ?
                <SettingsPage userRole={userRole} onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          {/* Student Feature Routes */}
          <Route
            path="/student/profile"
            element={
              isAuthenticated && userRole === 'student' ?
                <ProfilePage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/drives"
            element={
              isAuthenticated && userRole === 'student' ?
                <PlacementDrivesPage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/applications"
            element={
              isAuthenticated && userRole === 'student' ?
                <ApplicationsPage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/analytics"
            element={
              isAuthenticated && userRole === 'student' ?
                <AnalyticsPage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/resume"
            element={
              isAuthenticated && userRole === 'student' ?
                <ResumePage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student/results"
            element={
              isAuthenticated && userRole === 'student' ?
                <ResultsPage onLogout={handleLogout} /> :
                <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? `/${userRole}/welcome` : "/login"} replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;