import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function DashboardLayout() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
          <Toolbar sx={{ display: { xs: 'none', md: 'block' } }} />
          <Outlet />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
