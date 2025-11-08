import React from 'react';
import {
  Card,
  Box,
  Typography,
  Chip
} from '@mui/material';

const EnhancedQuickActionCard = ({ action, index }) => {
  return (
    <Card
      className="enhanced-quick-action-card"
      onClick={action.action}
      sx={{
        cursor: 'pointer',
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: action.color,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.05)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          '& .action-icon': {
            transform: 'scale(1.3) rotate(8deg)',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
          },
          '& .glow-effect': {
            opacity: 1,
            transform: 'scale(1.1)',
          },
          '& .sparkle-effect': {
            opacity: 1,
            animation: 'sparkle 1.5s ease-in-out infinite',
          }
        },
        '&:active': {
          transform: 'translateY(-6px) scale(1.02)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)
          `,
          opacity: 0.8,
          transition: 'all 0.6s ease',
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        className="floating-bg"
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: `${index * 0.5}s`,
        }}
      />
      
      <Box
        className="floating-bg"
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          animation: 'float 3s ease-in-out infinite',
          animationDelay: `${index * 0.3}s`,
        }}
      />

      {/* Shimmer Effect */}
      <Box
        className="shimmer-effect"
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          animation: 'shimmer 3s infinite',
          transition: 'left 0.6s ease',
        }}
      />

      {/* Glowing Border Effect */}
      <Box
        className="glow-effect"
        sx={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          borderRadius: '22px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
          opacity: 0,
          transition: 'all 0.4s ease',
          zIndex: -1,
        }}
      />

      {/* Decorative Sparkles */}
      <Box
        className="sparkle-effect"
        sx={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: 6,
          height: 6,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '50%',
          opacity: 0.6,
          animation: 'twinkle 2s ease-in-out infinite',
        }}
      />
      
      <Box
        className="sparkle-effect"
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '25%',
          width: 4,
          height: 4,
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
          opacity: 0.6,
          animation: 'twinkle 2.5s ease-in-out infinite',
          animationDelay: '0.5s',
        }}
      />

      {/* Main Content */}
      <Box sx={{ p: 4, zIndex: 2, position: 'relative' }}>
        <Box
          className="action-icon"
          sx={{
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            mb: 2,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          }}
        >
          {React.cloneElement(action.icon, { 
            sx: { 
              fontSize: 50, 
              color: 'white',
              transition: 'all 0.3s ease',
            }
          })}
        </Box>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mt: 2, 
            fontWeight: 'bold',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            fontSize: '1.3rem',
            letterSpacing: '0.5px',
          }}
        >
          {action.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 1.5, 
            opacity: 0.95,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            maxWidth: '85%',
            mx: 'auto',
            fontWeight: 400,
          }}
        >
          {action.description}
        </Typography>
        
        {/* Enhanced Action Badge */}
        <Chip
          label="✨ Explore"
          size="small"
          sx={{
            mt: 2.5,
            backgroundColor: 'rgba(255,255,255,0.25)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            height: 28,
            borderRadius: '20px',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.35)',
              transform: 'scale(1.1)',
            }
          }}
        />
      </Box>
    </Card>
  );
};

export default EnhancedQuickActionCard;