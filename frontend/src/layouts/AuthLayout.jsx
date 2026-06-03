import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthLayout() {
  return (
    <Box>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ overflow: 'hidden', boxShadow: '0 24px 80px rgba(15,23,42,0.12)' }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            minHeight: { md: 620 }
          }}>
            <Box sx={{
              p: { xs: 4, md: 6 },
              background: 'linear-gradient(160deg, rgba(15,118,110,0.96), rgba(30,64,175,0.92))',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>Insurance Matrix</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                  Policy journeys built for clarity and speed.
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 420, opacity: 0.9 }}>
                  Customers can apply, upload documents, and track approvals while admins manage plans, verifications, and reports from one workspace.
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Secure workflow, responsive interface, and production-ready API integration.
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Outlet />
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}
