
import { useAuth } from '@/hooks/use-auth';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
