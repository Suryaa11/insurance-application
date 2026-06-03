import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';

export default function PlanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    api.get(`/plans/${id}`).then(({ data }) => setPlan(data.data));
  }, [id]);

  if (!plan) return <Loader />;

  return (
    <Box>
      <PageHeader title={plan.planName} subtitle="Detailed coverage and eligibility information." />
      <Card>
        <CardContent sx={{ display: 'grid', gap: 2 }}>
          <Typography>{plan.description}</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Coverage: ₹${plan.coverageAmount}`} />
            <Chip label={`Premium: ₹${plan.premiumAmount}`} color="primary" />
            <Chip label={`Active: ${plan.isActive ? 'Yes' : 'No'}`} />
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Eligibility</Typography>
          <Typography color="text.secondary">{plan.eligibilityCriteria}</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Benefits</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {plan.benefits?.map((benefit) => <Chip key={benefit} label={benefit} />)}
          </Stack>
          <Button variant="contained" onClick={() => navigate(`/customer/apply/${plan._id}`)} sx={{ width: 'fit-content' }}>
            Apply now
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
