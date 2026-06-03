import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { Users, Store, AlertTriangle, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { stats } = useAdmin();

  const currentStats = stats || {
    totalUsers: 0,
    totalCafes: 0,
    totalReports: 0,
    activeReports: 0,
  };

  const statCards = [
    {
      key: 'users',
      label: language === 'jp' ? '総ユーザー数' : 'Tổng người dùng',
      sublabel: language === 'jp' ? '登録済みアカウント' : 'Tài khoản đã đăng ký',
      value: currentStats.totalUsers,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      numColor: 'text-blue-700',
      borderColor: 'border-l-blue-500',
      badge: null,
    },
    {
      key: 'cafes',
      label: language === 'jp' ? '総カフェ数' : 'Tổng quán cà phê',
      sublabel: language === 'jp' ? 'システム登録済み' : 'Đã đăng ký trong hệ thống',
      value: currentStats.totalCafes,
      icon: Store,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      numColor: 'text-green-700',
      borderColor: 'border-l-green-500',
      badge: null,
    },
    {
      key: 'reports',
      label: language === 'jp' ? '総レポート数' : 'Tổng báo cáo',
      sublabel: language === 'jp' ? '全期間の累計' : 'Tổng cộng tất cả thời gian',
      value: currentStats.totalReports,
      icon: BarChart3,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      numColor: 'text-amber-700',
      borderColor: 'border-l-amber-500',
      badge: null,
    },
    {
      key: 'active',
      label: language === 'jp' ? '未処理レポート' : 'Báo cáo chờ xử lý',
      sublabel: language === 'jp' ? '早急な対応が必要' : 'Cần xử lý sớm',
      value: currentStats.activeReports,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      numColor: 'text-red-700',
      borderColor: 'border-l-red-500',
      badge: currentStats.activeReports > 0
        ? language === 'jp' ? '要対応' : 'Cần xử lý'
        : null,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-8 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`bg-white rounded-2xl shadow-md border border-gray-100 border-l-4 ${card.borderColor} p-6 flex items-center gap-5`}
            >
              {/* Icon block */}
              <div className={`${card.iconBg} rounded-2xl p-4 shrink-0`}>
                <Icon className={`size-8 ${card.iconColor}`} />
              </div>

              {/* Text block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-500 leading-snug">
                    {card.label}
                  </p>
                  {card.badge && (
                    <span className="shrink-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className={`text-5xl font-black tracking-tight mt-1 ${card.numColor}`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {card.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
