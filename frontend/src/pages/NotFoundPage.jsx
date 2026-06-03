import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>404</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          The page you are looking for is not available.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">Go home</Button>
      </Box>
    </Box>
  );
}
