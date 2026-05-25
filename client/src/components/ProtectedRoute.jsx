import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container-page py-16 text-sm text-ink/60">Checking your session...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
}
