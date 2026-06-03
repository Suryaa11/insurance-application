import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const emptyForm = {
  planName: '',
  description: '',
  coverageAmount: '',
  premiumAmount: '',
  eligibilityCriteria: '',
  benefits: ''
};

export default function PlansManagementPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/plans/admin');
    setPlans(data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      coverageAmount: Number(form.coverageAmount),
      premiumAmount: Number(form.premiumAmount),
      benefits: form.benefits.split(',').map((item) => item.trim()).filter(Boolean)
    };

    if (editingId) {
      await api.put(`/plans/${editingId}`, payload);
      setMessage('Plan updated.');
    } else {
      await api.post('/plans', payload);
      setMessage('Plan created.');
    }
    setForm(emptyForm);
    setEditingId(null);
    await load();
  };

  const editPlan = (plan) => {
    setEditingId(plan._id);
    setForm({
      planName: plan.planName,
      description: plan.description,
      coverageAmount: plan.coverageAmount,
      premiumAmount: plan.premiumAmount,
      eligibilityCriteria: plan.eligibilityCriteria,
      benefits: (plan.benefits || []).join(', ')
    });
  };

  const deletePlan = async (id) => {
    await api.delete(`/plans/${id}`);
    await load();
  };

  return (
    <Box>
      <PageHeader title="Plans Management" subtitle="Create, edit, and retire insurance plans." />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h6">{editingId ? 'Edit Plan' : 'Create Plan'}</Typography>
              {['planName', 'description', 'coverageAmount', 'premiumAmount', 'eligibilityCriteria', 'benefits'].map((field) => (
                <TextField
                  key={field}
                  label={field.replace(/([A-Z])/g, ' $1')}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  multiline={field === 'description' || field === 'eligibilityCriteria' || field === 'benefits'}
                  minRows={field === 'description' || field === 'eligibilityCriteria' || field === 'benefits' ? 3 : 1}
                  required
                />
              ))}
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">{editingId ? 'Update' : 'Create'}</Button>
                {editingId && <Button onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Coverage</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan._id}>
                      <TableCell>{plan.planName}</TableCell>
                      <TableCell>{plan.coverageAmount}</TableCell>
                      <TableCell>{plan.premiumAmount}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => editPlan(plan)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => deletePlan(plan._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
