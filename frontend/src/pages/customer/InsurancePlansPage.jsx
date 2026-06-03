import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

export default function InsurancePlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/plans').then(({ data }) => setPlans(data.data));
  }, []);

  return (
    <Box>
      <PageHeader title="Insurance Plans" subtitle="Browse active plans and review coverage details." />
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} xl={4} key={plan._id}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'grid', gap: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{plan.planName}</Typography>
                  <Chip label={`₹${plan.premiumAmount}/yr`} color="primary" />
                </Stack>
                <Typography color="text.secondary">{plan.description}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {plan.benefits?.slice(0, 3).map((benefit) => <Chip key={benefit} label={benefit} size="small" />)}
                </Stack>
                <Stack direction="row" spacing={1.5}>
                  <Button component={RouterLink} to={`/customer/plans/${plan._id}`} variant="outlined">Details</Button>
                  <Button component={RouterLink} to={`/customer/apply/${plan._id}`} variant="contained">Apply</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
