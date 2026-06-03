import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">Insurance Management Application</Typography>
      <Typography variant="caption">Secure workflows for customers and admins</Typography>
    </Box>
  );
}
