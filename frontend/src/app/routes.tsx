import { createBrowserRouter, Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth, type User } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CafeDetailPage from './pages/CafeDetailPage';
import CafeSetupPage from './pages/CafeSetupPage';
import OwnerHomePage from './pages/OwnerHomePage';
import OwnerCafeDetailPage from './pages/OwnerCafeDetailPage';
import OwnerProfilePage from './pages/OwnerProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminCafeManagementPage from './pages/AdminCafeManagementPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminLayout from './pages/AdminLayout';
import StaffHomePage from './pages/StaffHomePage';
import StaffCafeDetailPage from './pages/StaffCafeDetailPage';
import StaffProfilePage from './pages/StaffProfilePage';

const ROLE_HOME: Record<number, string> = {
  1: '/home',
  2: '/owner',
  3: '/admin',
  4: '/staff',
};

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: User['role'][];
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    const homePath = ROLE_HOME[user.role] ?? '/login';
    return <Navigate to={homePath} replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/home',
    element: <ProtectedRoute allowedRoles={[1]}><HomePage /></ProtectedRoute>,
  },
  {
    path: '/cafe/:id',
    element: <ProtectedRoute allowedRoles={[1]}><CafeDetailPage /></ProtectedRoute>,
  },
  {
    path: '/cafe-setup',
    element: <ProtectedRoute allowedRoles={[2]}><CafeSetupPage /></ProtectedRoute>,
  },
  {
    path: '/owner',
    element: <ProtectedRoute allowedRoles={[2]}><OwnerHomePage /></ProtectedRoute>,
  },
  {
    path: '/owner/cafe/:id',
    element: <ProtectedRoute allowedRoles={[2]}><OwnerCafeDetailPage /></ProtectedRoute>,
  },
  {
    path: '/owner/profile',
    element: <ProtectedRoute allowedRoles={[2]}><OwnerProfilePage /></ProtectedRoute>,
  },
  {
    path: '/staff',
    element: <ProtectedRoute allowedRoles={[4]}><StaffHomePage /></ProtectedRoute>,
  },
  {
    path: '/staff/cafe/:id',
    element: <ProtectedRoute allowedRoles={[4]}><StaffCafeDetailPage /></ProtectedRoute>,
  },
  {
    path: '/staff/profile',
    element: <ProtectedRoute allowedRoles={[4]}><StaffProfilePage /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={[3]}><AdminLayout /></ProtectedRoute>,
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <AdminUserManagementPage />,
      },
      {
        path: 'cafes',
        element: <AdminCafeManagementPage />,
      },
      {
        path: 'reports',
        element: <AdminReportsPage />,
      },
    ],
  },
]);
