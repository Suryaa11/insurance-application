import React from 'react';
import { Card, CardContent, Stack, Typography, Chip, Divider } from '@mui/material';

export default function NotificationPanel({ notifications = [] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Chip label={notifications.length} size="small" color="primary" />
        </Stack>
        <Stack spacing={1.5}>
          {notifications.length ? notifications.map((notification) => (
            <Card key={notification._id} variant="outlined" sx={{ bgcolor: notification.read ? 'transparent' : 'rgba(15,118,110,0.06)' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )) : (
            <Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
