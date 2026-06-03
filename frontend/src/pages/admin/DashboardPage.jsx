import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data: response }) => setData(response.data));
  }, []);

  const stats = data ? [
    { label: 'Total Applications', value: data.totalApplications, icon: <ApartmentIcon color="primary" fontSize="large" /> },
    { label: 'Pending Applications', value: data.pendingApplications, icon: <PendingActionsIcon color="secondary" fontSize="large" /> },
    { label: 'Approved Applications', value: data.approvedApplications, icon: <VerifiedIcon color="primary" fontSize="large" /> },
    { label: 'Rejected Applications', value: data.rejectedApplications, icon: <CancelIcon color="secondary" fontSize="large" /> }
  ] : [];

  return (
    <Box>
      <PageHeader title="Admin Dashboard" subtitle="Operational overview for applications and reviews." />
      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.label}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
