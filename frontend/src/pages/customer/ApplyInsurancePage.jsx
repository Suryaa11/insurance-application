import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const initialForm = {
  selectedPlan: '',
  personalInformation: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    occupation: ''
  },
  addressInformation: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  },
  nomineeInformation: {
    name: '',
    relationship: '',
    phone: '',
    email: ''
  }
};

export default function ApplyInsurancePage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initialForm, selectedPlan: planId });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/plans/${planId}`).then(({ data }) => setPlan(data.data));
  }, [planId]);

  useEffect(() => {
    setForm((current) => ({ ...current, selectedPlan: planId }));
  }, [planId]);

  const updateNested = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/applications', form);
      setSuccess(`Application ${data.data.applicationNumber} submitted successfully.`);
      navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader title="Apply for Insurance" subtitle={plan?.planName || 'Complete your application with accurate information.'} />
      <Card>
        <CardContent component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Typography variant="h6">Personal Information</Typography>
          <Grid container spacing={2}>
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['dateOfBirth', 'Date of Birth'],
              ['gender', 'Gender'],
              ['phone', 'Phone'],
              ['email', 'Email'],
              ['occupation', 'Occupation']
            ].map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  label={label}
                  type={field === 'dateOfBirth' ? 'date' : 'text'}
                  InputLabelProps={field === 'dateOfBirth' ? { shrink: true } : undefined}
                  value={form.personalInformation[field]}
                  onChange={(event) => updateNested('personalInformation', field, event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6">Address Information</Typography>
          <Grid container spacing={2}>
            {[
              ['addressLine1', 'Address Line 1'],
              ['addressLine2', 'Address Line 2'],
              ['city', 'City'],
              ['state', 'State'],
              ['postalCode', 'Postal Code'],
              ['country', 'Country']
            ].map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  label={label}
                  value={form.addressInformation[field]}
                  onChange={(event) => updateNested('addressInformation', field, event.target.value)}
                  fullWidth
                  required={field !== 'addressLine2'}
                />
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6">Nominee Information</Typography>
          <Grid container spacing={2}>
            {[
              ['name', 'Nominee Name'],
              ['relationship', 'Relationship'],
              ['phone', 'Phone'],
              ['email', 'Email']
            ].map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  label={label}
                  value={form.nomineeInformation[field]}
                  onChange={(event) => updateNested('nomineeInformation', field, event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
