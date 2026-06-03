import React, { useContext, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome back</Typography>
      <Typography color="text.secondary">
        Sign in to manage policies, approvals, and document workflows.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required fullWidth />
      <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required fullWidth />
      <Button type="submit" variant="contained" size="large" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </Button>
      <Stack direction="row" spacing={1}>
        <Typography variant="body2" color="text.secondary">Need an account?</Typography>
        <Typography component={RouterLink} to="/register" color="primary">Register</Typography>
      </Stack>
    </Box>
  );
}
