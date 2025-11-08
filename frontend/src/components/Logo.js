import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = ({ size = 'medium', color = 'inherit', variant = 'full' }) => {
  const sizeConfig = {
    small: { fontSize: '1.5rem', iconSize: 24 },
    medium: { fontSize: '2rem', iconSize: 32 },
    large: { fontSize: '2.5rem', iconSize: 40 }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  if (variant === 'icon') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.iconSize * 2,
          height: config.iconSize * 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: config.iconSize * 0.8
        }}
      >
        GP
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.iconSize * 1.5,
          height: config.iconSize * 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: config.iconSize * 0.6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
            animation: 'pulse 2s infinite'
          }}
        />
        GP
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: config.fontSize
        }}
      >
        GetPlaced
      </Typography>
    </Box>
  );
};

export default Logo;