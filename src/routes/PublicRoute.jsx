import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PATHS from './paths';

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
