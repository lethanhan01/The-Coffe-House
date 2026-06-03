import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getAdminStats, getAllUsers, getAllReports, type AdminStats, type AdminUser, type AdminReport } from '../services/adminService';
import { getAllCafes, type Cafe } from '../services/cafeService';

interface AdminContextType {
  stats: AdminStats | null;
  users: AdminUser[] | null;
  cafes: Cafe[] | null;
  reports: AdminReport[] | null;
  loading: boolean;
  setStats: React.Dispatch<React.SetStateAction<AdminStats | null>>;
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[] | null>>;
  setCafes: React.Dispatch<React.SetStateAction<Cafe[] | null>>;
  setReports: React.Dispatch<React.SetStateAction<AdminReport[] | null>>;
  refreshStats: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshCafes: () => Promise<void>;
  refreshReports: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [cafes, setCafes] = useState<Cafe[] | null>(null);
  const [reports, setReports] = useState<AdminReport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      if (data) setStats(data);
    } catch (error) {
      console.error('Failed to refresh admin stats:', error);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      if (data) setUsers(data);
    } catch (error) {
      console.error('Failed to refresh admin users:', error);
    }
  }, []);

  const refreshCafes = useCallback(async () => {
    try {
      const data = await getAllCafes();
      if (data) setCafes(data);
    } catch (error) {
      console.error('Failed to refresh admin cafes:', error);
    }
  }, []);

  const refreshReports = useCallback(async () => {
    try {
      const data = await getAllReports();
      if (data) setReports(data);
    } catch (error) {
      console.error('Failed to refresh admin reports:', error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, usersData, cafesData, reportsData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllCafes(),
        getAllReports(),
      ]);

      if (statsData) setStats(statsData);
      if (usersData) setUsers(usersData);
      if (cafesData) setCafes(cafesData);
      if (reportsData) setReports(reportsData);
    } catch (error) {
      console.error('Failed to refresh all admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        cafes,
        reports,
        loading,
        setStats,
        setUsers,
        setCafes,
        setReports,
        refreshStats,
        refreshUsers,
        refreshCafes,
        refreshReports,
        refreshAll,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
