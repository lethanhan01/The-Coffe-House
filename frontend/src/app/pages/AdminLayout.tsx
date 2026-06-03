import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin, AdminProvider } from '../contexts/AdminContext';
import { Button } from '../components/ui/button';
import { Coffee, Users, Store, AlertTriangle, BarChart3, User, TrendingUp } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

function AdminLayoutContent() {
  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, refreshAll } = useAdmin();

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navCls = (path: string) =>
    `w-full justify-start ${isActive(path) ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-gray-700'}`;

  const getTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return language === 'jp' ? 'ダッシュボード' : 'Dashboard';
      case '/admin/users':
        return language === 'jp' ? 'システムユーザー管理' : 'Quản lý người dùng hệ thống';
      case '/admin/cafes':
        return language === 'jp' ? 'カフェ管理' : 'Quản lý quán cà phê';
      case '/admin/reports':
        return language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo';
      default:
        return 'Admin';
    }
  };

  const activeReports = stats?.activeReports ?? 0;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ══ Sidebar ══ */}
      <div className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <div>
              <h1 className="font-bold">どこカフェ</h1>
              <span className="text-xs text-gray-500">
                {language === 'jp' ? '管理者' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className={navCls('/admin')} onClick={() => navigate('/admin')}>
            <BarChart3 className="size-4 mr-2" />
            {language === 'jp' ? 'ダッシュボード' : 'Dashboard'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/users')} onClick={() => navigate('/admin/users')}>
            <Users className="size-4 mr-2" />
            {language === 'jp' ? 'ユーザー管理' : 'Quản lý người dùng'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/cafes')} onClick={() => navigate('/admin/cafes')}>
            <Store className="size-4 mr-2" />
            {language === 'jp' ? 'カフェ管理' : 'Quản lý quán'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/reports')} onClick={() => navigate('/admin/reports')}>
            <AlertTriangle className="size-4 mr-2" />
            {language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo'}
            {activeReports > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                {activeReports}
              </span>
            )}
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            {language === 'jp' ? 'ログアウト' : 'Đăng xuất'}
          </Button>
        </div>
      </div>

      {/* ══ Main Content ══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="border-b bg-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-amber-700" />
            <h2 className="font-bold text-gray-800">
              {getTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutContent />
    </AdminProvider>
  );
}
