import { Role } from '@/services/auth';
import { useAuthStore } from '@/store';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthGuard: React.FC<{
  children: React.ReactElement;
  roles?: Role[];
}> = ({ children, roles }) => {
  const { user, tokens, logout } = useAuthStore();
  const isAuthenticated = user && tokens?.access_token;

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to={'/dashboard'} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return children;
};
