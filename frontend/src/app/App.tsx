import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { initializeMockData } from './utils/mockData';
import { Toaster } from './components/ui/sonner';

export default function App() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      initializeMockData();
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
