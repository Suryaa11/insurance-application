import React, { useContext } from 'react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Account details and session controls." />
      <Card>
        <CardContent sx={{ display: 'grid', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
          <Typography color="text.secondary">Role: {user?.role}</Typography>
          <Stack direction="row">
            <Button variant="contained" onClick={logout}>Logout</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
