import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container-page py-16 text-sm text-ink/60">Checking your session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
