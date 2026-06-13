import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { initializeMockData } from './utils/mockData';
import { Toaster } from './components/ui/sonner';

export default function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
