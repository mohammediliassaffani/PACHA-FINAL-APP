import { useAuthStore } from '@/store';
import React from 'react';
import { Navigate } from 'react-router-dom';

export const UnauthGuard: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to={'/dashboard'} />;
  }

  return children;
};
