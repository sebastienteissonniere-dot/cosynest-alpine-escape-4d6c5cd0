import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated users to backoffice login
    return <Navigate to="/backoffice/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="bg-slate-800 p-8 rounded-xl border border-red-500/30 max-w-md text-center space-y-4">
          <div className="inline-flex p-3 bg-red-500/10 text-red-400 rounded-full">
            ⚠️
          </div>
          <h2 className="text-xl font-bold">Accès Non Autorisé</h2>
          <p className="text-slate-400 text-sm">
            Votre rôle ({user.role}) n'a pas les privilèges requis pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
