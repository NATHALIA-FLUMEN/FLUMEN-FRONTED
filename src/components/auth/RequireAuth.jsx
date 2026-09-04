import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function RequireAuth({ children, adminOnly = false }) {
  const { user, loading, initializing } = useAuth();
  const location = useLocation();

  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}
