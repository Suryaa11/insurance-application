import React from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';

export default function SearchFilters({ filters, onChange, onSearch }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr auto' }, alignItems: 'center' }}>
      <TextField
        label="Search"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Application number or customer name"
        fullWidth
      />
      <TextField
        select
        label="Status"
        value={filters.status}
        onChange={(event) => onChange('status', event.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="SUBMITTED">Submitted</MenuItem>
        <MenuItem value="PENDING_VERIFICATION">Pending Verification</MenuItem>
        <MenuItem value="APPROVED">Approved</MenuItem>
        <MenuItem value="REJECTED">Rejected</MenuItem>
      </TextField>
      <TextField
        label="From"
        type="date"
        value={filters.startDate}
        onChange={(event) => onChange('startDate', event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To"
        type="date"
        value={filters.endDate}
        onChange={(event) => onChange('endDate', event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={onSearch} sx={{ height: 56 }}>
        Search
      </Button>
    </Box>
  );
}
