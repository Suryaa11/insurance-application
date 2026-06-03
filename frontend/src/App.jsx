import React, { Suspense, useContext, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthContext } from './context/AuthContext';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const CustomerDashboardPage = lazy(() => import('./pages/customer/DashboardPage'));
const InsurancePlansPage = lazy(() => import('./pages/customer/InsurancePlansPage'));
const PlanDetailsPage = lazy(() => import('./pages/customer/PlanDetailsPage'));
const ApplyInsurancePage = lazy(() => import('./pages/customer/ApplyInsurancePage'));
const DocumentsPage = lazy(() => import('./pages/customer/DocumentsPage'));
const NotificationsPage = lazy(() => import('./pages/customer/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminApplicationsPage = lazy(() => import('./pages/admin/ApplicationsPage'));
const ApplicationDetailsPage = lazy(() => import('./pages/admin/ApplicationDetailsPage'));
const PlansManagementPage = lazy(() => import('./pages/admin/PlansManagementPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function RootRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Loader fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer'} replace />;
}

export default function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top left, rgba(15,118,110,0.12), transparent 30%), radial-gradient(circle at top right, rgba(194,65,12,0.10), transparent 25%), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)'
    }}>
      <Suspense fallback={<Loader fullscreen />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/customer"
            element={<ProtectedRoute roles={['CUSTOMER']}><DashboardLayout /></ProtectedRoute>}
          >
            <Route index element={<CustomerDashboardPage />} />
            <Route path="plans" element={<InsurancePlansPage />} />
            <Route path="plans/:id" element={<PlanDetailsPage />} />
            <Route path="apply/:planId" element={<ApplyInsurancePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route
            path="/admin"
            element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="plans" element={<PlansManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Box>
  );
}
