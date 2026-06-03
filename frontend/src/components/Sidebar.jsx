import React, { useContext } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const customerItems = [
  { label: 'Dashboard', to: '/customer', icon: <DashboardIcon /> },
  { label: 'Plans', to: '/customer/plans', icon: <FavoriteIcon /> },
  { label: 'Documents', to: '/customer/documents', icon: <DescriptionIcon /> },
  { label: 'Notifications', to: '/customer/notifications', icon: <NotificationsIcon /> },
  { label: 'Profile', to: '/customer/profile', icon: <PersonIcon /> }
];

const adminItems = [
  { label: 'Dashboard', to: '/admin', icon: <DashboardIcon /> },
  { label: 'Applications', to: '/admin/applications', icon: <AssignmentIcon /> },
  { label: 'Plans', to: '/admin/plans', icon: <FavoriteIcon /> },
  { label: 'Reports', to: '/admin/reports', icon: <BarChartIcon /> }
];

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const items = user?.role === 'ADMIN' ? adminItems : customerItems;

  return (
    <Box sx={{
      width: { xs: '100%', md: 280 },
      borderRight: { md: '1px solid rgba(15,118,110,0.10)' },
      background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))',
      p: 2,
      minHeight: { md: 'calc(100vh - 64px)' }
    }}>
      <Typography variant="overline" color="text.secondary">Workspace</Typography>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        {user?.role === 'ADMIN' ? 'Admin Console' : 'Customer Portal'}
      </Typography>
      <Chip label={user?.role || 'Guest'} color="primary" sx={{ mb: 2 }} />
      <Divider sx={{ mb: 2 }} />
      <List sx={{ display: 'grid', gap: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              borderRadius: 3,
              '&.active': {
                bgcolor: 'rgba(15,118,110,0.12)',
                color: 'primary.main'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
