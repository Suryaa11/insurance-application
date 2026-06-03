import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Chip } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(8, 47, 73, 0.9)', backdropFilter: 'blur(18px)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip label="IM" color="secondary" sx={{ fontWeight: 700 }} />
          <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
            Insurance Matrix
          </Typography>
        </Stack>
        {user ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button variant="contained" color="secondary" component={RouterLink} to="/register">Register</Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
