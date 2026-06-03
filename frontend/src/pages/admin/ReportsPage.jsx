import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get('/reports/summary').then(({ data }) => setReport(data.data));
  }, []);

  const stats = report ? [
    { label: 'Total Applications', value: report.totalApplications, icon: <AssessmentIcon color="primary" fontSize="large" /> },
    { label: 'Approved', value: report.approvedApplications, icon: <CheckCircleIcon color="primary" fontSize="large" /> },
    { label: 'Rejected', value: report.rejectedApplications, icon: <CancelIcon color="secondary" fontSize="large" /> },
    { label: 'Pending', value: report.pendingApplications, icon: <HourglassBottomIcon color="secondary" fontSize="large" /> }
  ] : [];

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Operational summary for applications." />
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
