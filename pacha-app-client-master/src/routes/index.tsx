import { DashboardLayout } from '@/components/layout';
import { AuthGuard, UnauthGuard } from '@/components/layout/hoc';
import { Dashboard, LoginPage } from '@/pages';

import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <UnauthGuard>
        <LoginPage />
      </UnauthGuard>
    ),
  },

  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
    ],
  },
];
