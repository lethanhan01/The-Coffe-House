import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { AdminProvider } from './contexts/AdminContext';
import { useAuth, type User } from './contexts/AuthContext';

// Entry-point pages stay eager — lazy-loading them would flash before anything renders
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// All other pages: lazy-loaded per role
const HomePage = lazy(() => import('./pages/HomePage'));
const CafeDetailPage = lazy(() => import('./pages/CafeDetailPage'));

const CafeSetupPage = lazy(() => import('./pages/CafeSetupPage'));
const OwnerHomePage = lazy(() => import('./pages/OwnerHomePage'));
const OwnerCafeDetailPage = lazy(() => import('./pages/OwnerCafeDetailPage'));
const OwnerProfilePage = lazy(() => import('./pages/OwnerProfilePage'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUserManagementPage = lazy(() => import('./pages/AdminUserManagementPage'));
const AdminCafeManagementPage = lazy(() => import('./pages/AdminCafeManagementPage'));
const AdminReportsPage = lazy(() => import('./pages/AdminReportsPage'));
const AdminLayout = lazy(() => import('./pages/AdminLayout'));

const StaffHomePage = lazy(() => import('./pages/StaffHomePage'));
const StaffCafeDetailPage = lazy(() => import('./pages/StaffCafeDetailPage'));
const StaffProfilePage = lazy(() => import('./pages/StaffProfilePage'));

const ROLE_HOME: Record<number, string> = {
  1: '/home',
  2: '/owner',
  3: '/admin',
  4: '/staff',
};

const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  </div>
);

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: User['role'][];
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    const homePath = ROLE_HOME[user.role] ?? '/login';
    return <Navigate to={homePath} replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/home',
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <Suspense fallback={<PageSpinner />}><HomePage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/cafe/:id',
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <Suspense fallback={<PageSpinner />}><CafeDetailPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/cafe-setup',
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <Suspense fallback={<PageSpinner />}><CafeSetupPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <Suspense fallback={<PageSpinner />}><OwnerHomePage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/owner/cafe/:id',
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <Suspense fallback={<PageSpinner />}><OwnerCafeDetailPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/owner/profile',
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <Suspense fallback={<PageSpinner />}><OwnerProfilePage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRoles={[4]}>
        <Suspense fallback={<PageSpinner />}><StaffHomePage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/cafe/:id',
    element: (
      <ProtectedRoute allowedRoles={[4]}>
        <Suspense fallback={<PageSpinner />}><StaffCafeDetailPage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/profile',
    element: (
      <ProtectedRoute allowedRoles={[4]}>
        <Suspense fallback={<PageSpinner />}><StaffProfilePage /></Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[3]}>
        <AdminProvider>
          <Suspense fallback={<PageSpinner />}><AdminLayout /></Suspense>
        </AdminProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Suspense fallback={<PageSpinner />}><AdminDashboard /></Suspense>,
      },
      {
        path: 'users',
        element: <Suspense fallback={<PageSpinner />}><AdminUserManagementPage /></Suspense>,
      },
      {
        path: 'cafes',
        element: <Suspense fallback={<PageSpinner />}><AdminCafeManagementPage /></Suspense>,
      },
      {
        path: 'reports',
        element: <Suspense fallback={<PageSpinner />}><AdminReportsPage /></Suspense>,
      },
    ],
  },
]);
