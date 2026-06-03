import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ fullscreen = false }) {
  const content = (
    <Box sx={{ display: 'grid', placeItems: 'center', gap: 2, py: 6 }}>
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">
        Loading insurance workspace
      </Typography>
    </Box>
  );

  if (!fullscreen) return content;

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      {content}
    </Box>
  );
}
