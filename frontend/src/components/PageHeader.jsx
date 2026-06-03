import React from 'react';
import { Box, Breadcrumbs, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, actions, crumbs = [] }) {
  return (
    <Box sx={{ mb: 3 }}>
      {crumbs.length ? (
        <Breadcrumbs sx={{ mb: 1 }}>
          {crumbs}
        </Breadcrumbs>
      ) : null}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{title}</Typography>
          {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
        </Box>
        {actions}
      </Box>
    </Box>
  );
}
