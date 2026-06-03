import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Pagination, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import SearchFilters from '../../components/SearchFilters';

export default function ApplicationsPage() {
  const [filters, setFilters] = useState({ search: '', status: '', startDate: '', endDate: '' });
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const load = async (nextPage = pagination.page) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', String(nextPage));
    const { data } = await api.get(`/applications/admin?${params.toString()}`);
    setApplications(data.data.data);
    setPagination(data.data.pagination);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <PageHeader title="Applications" subtitle="Search, filter, and review customer submissions." />
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <SearchFilters
            filters={filters}
            onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
          onSearch={() => load(1)}
        />
      </CardContent>
      </Card>
      <Card>
        <CardContent sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>{application.applicationNumber}</TableCell>
                  <TableCell>{application.customer?.name}</TableCell>
                  <TableCell>{application.selectedPlan?.planName}</TableCell>
                  <TableCell><Chip label={application.status} size="small" /></TableCell>
                  <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography component={RouterLink} to={`/admin/applications/${application._id}`} color="primary">
                      View
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Pagination
              count={pagination.pages || 1}
              page={pagination.page || 1}
              onChange={(_, value) => load(value)}
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
