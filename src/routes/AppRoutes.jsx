import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PATHS from './paths';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy loading all layouts and pages
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SchedulerAccountsPage = lazy(
  () => import('@/pages/SchedulerAccountsPage'),
);
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public Routes (Auth Layout) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={PATHS.LOGIN} element={<LoginPage />} />
            <Route
              path={PATHS.FORGOT_PASSWORD}
              element={<ForgotPasswordPage />}
            />
            <Route
              path={PATHS.RESET_PASSWORD}
              element={<ResetPasswordPage />}
            />
          </Route>
        </Route>

        {/* Protected Routes (Main Layout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
            <Route
              path={PATHS.SCHEDULERS}
              element={<SchedulerAccountsPage />}
            />
            <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
          </Route>
        </Route>

        {/* Fallback & Redirects */}
        <Route
          path={PATHS.HOME}
          element={<Navigate to={PATHS.DASHBOARD} replace />}
        />
        <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
