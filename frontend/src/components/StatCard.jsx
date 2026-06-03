import React from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function StatCard({ label, value, helper, icon }) {
  return (
    <Card sx={{ height: '100%', background: 'linear-gradient(180deg, rgba(15,118,110,0.06), rgba(255,255,255,1))' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <div>
            <Typography variant="overline" color="text.secondary">{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
            {helper && <Typography variant="body2" color="text.secondary">{helper}</Typography>}
          </div>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}
