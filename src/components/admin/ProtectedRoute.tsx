import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if there's an active session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Verify the session is still valid
      const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);

      if (userError || !user) {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session');
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#155020] animate-spin mx-auto mb-4" />
          <p className="text-[#155020]/60 font-sans-brand">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}