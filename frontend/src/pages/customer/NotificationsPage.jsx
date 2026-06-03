import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const { data } = await api.get('/notifications/mine');
    setNotifications(data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    await load();
  };

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle="Monitor application and document activity."
        actions={<Button variant="contained" onClick={markAllRead}>Mark all read</Button>}
      />
      <Stack spacing={2}>
        {notifications.map((notification) => (
          <Card key={notification._id}>
            <CardContent>
              <Typography sx={{ fontWeight: 700 }}>{notification.message}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(notification.createdAt).toLocaleString()} · {notification.read ? 'Read' : 'Unread'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
