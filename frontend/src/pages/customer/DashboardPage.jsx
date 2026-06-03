import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import NotificationPanel from '../../components/NotificationPanel';
import PageHeader from '../../components/PageHeader';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/customer').then(({ data: response }) => setData(response.data));
  }, []);

  const stats = data ? [
    { label: 'Total Applications', value: data.totalApplications, icon: <AccountBalanceIcon color="primary" fontSize="large" /> },
    { label: 'Current Status', value: data.currentStatus || 'N/A', icon: <AssignmentTurnedInIcon color="secondary" fontSize="large" /> },
    { label: 'Uploaded Documents', value: data.uploadedDocuments, icon: <UploadFileIcon color="primary" fontSize="large" /> },
    { label: 'Unread Notifications', value: data.unreadNotifications, icon: <MarkEmailUnreadIcon color="secondary" fontSize="large" /> }
  ] : [];

  return (
    <Box>
      <PageHeader
        title="Customer Dashboard"
        subtitle="Track applications, documents, and notifications from one place."
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.label}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>
      <NotificationPanel notifications={data?.notifications || []} />
    </Box>
  );
}
