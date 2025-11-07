import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import HODDashboard from './pages/HODDashboard';
import TPODashboard from './pages/TPODashboard';
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
                <Navigate to={`/${userRole}`} replace /> : 
                <LoginPage onLogin={handleLogin} />
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
            path="/" 
            element={
              <Navigate to={isAuthenticated ? `/${userRole}` : "/login"} replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;