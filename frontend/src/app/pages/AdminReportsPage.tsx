import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LanguageToggle } from '../components/LanguageToggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Coffee, Users, Store, AlertTriangle, BarChart3, User,
  CheckCircle, XCircle, Eye,
  Calendar, Clock, Flag, ChevronRight,
} from 'lucide-react';
import { getAllReports, updateReportStatus } from '../services/adminService';

/* ── Types ── */
type ReportType = 'review_complaint' | 'cafe_delete';
type ReportStatus = 'active' | 'resolved' | 'rejected';
type FilterType = 'all' | 'review_complaint' | 'cafe_delete';

interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  title: string;
  titleJP: string;
  description: string;
  descriptionJP: string;
  cafeName: string | null;
  cafeNameJP: string | null;
  reporterName: string | null;
  targetInfo: string | null;
  targetInfoJP: string | null;
  createdAt: string;
}

/* ── Seed mock reports (stored in localStorage under 'reports') ── */
/* ── Component ── */
export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeReports, setActiveReports] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  /* load */
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getAllReports();
        if (!data) {
          setLoadError(language === 'jp'
            ? 'レポートを読み込めませんでした。アクセストークンを確認してください。'
            : 'Không thể tải báo cáo. Vui lòng kiểm tra quyền truy cập.');
          setReports([]);
          setActiveReports(0);
          return;
        }
        setReports(data);
        setActiveReports(data.filter((r) => r.status === 'active').length);
        setLoadError(null);
      } catch (error: any) {
        console.error('Failed to load reports:', error);
        setLoadError(error?.message || 'Failed to load reports');
      }
    };

    loadReports();
  }, []);

  /* helpers */
  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path: string) => location.pathname === path;
  const navCls = (path: string) =>
    `w-full justify-start ${isActive(path) ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-gray-700'}`;

  /* filtering */
  const filtered = reports.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (dateFrom) {
      const d = new Date(r.createdAt);
      if (d < new Date(dateFrom + 'T00:00:00')) return false;
    }
    if (dateTo) {
      const d = new Date(r.createdAt);
      if (d > new Date(dateTo + 'T23:59:59')) return false;
    }
    return true;
  });

  /* approve / reject */
  const handleAction = async (id: string, action: 'resolved' | 'rejected') => {
    const success = await updateReportStatus(id, action);
    if (!success) {
      console.error('Failed to update report status');
      return;
    }

    const updated = reports.map((r) => (r.id === id ? { ...r, status: action } : r));
    setReports(updated);
    setActiveReports(updated.filter((r) => r.status === 'active').length);
    if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status: action });
  };

  /* label helpers */
  const typeLabel = (type: ReportType) =>
    type === 'review_complaint'
      ? language === 'jp' ? 'レビュー申し立て' : 'Đơn kiến nghị'
      : language === 'jp' ? 'カフェ削除依頼' : 'Xóa quán';

  const typeBadgeCls = (type: ReportType) =>
    type === 'review_complaint'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-orange-100 text-orange-700';

  const statusBadgeCls = (status: ReportStatus) => ({
    active: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }[status]);

  const statusLabel = (status: ReportStatus) => ({
    active: language === 'jp' ? '未処理' : 'Chờ xử lý',
    resolved: language === 'jp' ? '承認済み' : 'Đã chấp thuận',
    rejected: language === 'jp' ? '却下済み' : 'Đã từ chối',
  }[status]);

  const fmtDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN'),
      time: d.toLocaleTimeString(language === 'jp' ? 'ja-JP' : 'vi-VN', {
        hour: '2-digit', minute: '2-digit',
      }),
    };
  };

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
          <h2 className="font-bold text-gray-800">
            {language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo'}
          </h2>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto space-y-5">

          {/* ── Filter area ── */}
          <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">

            {/* Row 1: date range */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                <Calendar className="size-4" />
                <span>{language === 'jp' ? '期間:' : 'Khoảng thời gian:'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  className="w-40 text-sm"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="text-gray-400 text-sm">→</span>
                <Input
                  type="date"
                  className="w-40 text-sm"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                />
                {(dateFrom || dateTo) && (
                  <button
                    className="text-xs text-amber-700 hover:underline"
                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                  >
                    {language === 'jp' ? 'クリア' : 'Xóa'}
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: type tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 shrink-0">
                {language === 'jp' ? '種類:' : 'Loại đơn:'}
              </span>
              {(
                [
                  { key: 'all',               labelVN: 'Tất cả',         labelJP: 'すべて' },
                  { key: 'review_complaint',   labelVN: 'Đơn kiến nghị', labelJP: 'レビュー申し立て' },
                  { key: 'cafe_delete',        labelVN: 'Xóa quán',      labelJP: 'カフェ削除' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    filterType === tab.key
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {language === 'jp' ? tab.labelJP : tab.labelVN}
                  {tab.key !== 'all' && (
                    <span className="ml-1.5 opacity-70">
                      ({reports.filter((r) => r.type === tab.key).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          {loadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {loadError}
            </div>
          )}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 border-b">
                    <th className="text-center py-3 px-4 w-12">
                      {language === 'jp' ? '番号' : 'STT'}
                    </th>
                    <th className="text-left py-3 px-4">
                      {language === 'jp' ? '内容' : 'Nội dung'}
                    </th>
                    <th className="text-center py-3 px-4 whitespace-nowrap">
                      {language === 'jp' ? '受信日時' : 'Ngày & Giờ nhận'}
                    </th>
                    <th className="text-center py-3 px-4 min-w-[220px]">
                      {language === 'jp' ? 'アクション' : 'Hành động'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-14 text-gray-400">
                        <Flag className="size-10 mx-auto mb-2 opacity-30" />
                        <p>{language === 'jp' ? 'レポートがありません' : 'Không có báo cáo nào'}</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((report, idx) => {
                      const { date, time } = fmtDateTime(report.createdAt);
                      const isNew = report.status === 'active';
                      return (
                        <tr
                          key={report.id}
                          className={`border-b last:border-b-0 transition-colors ${
                            isNew ? 'hover:bg-amber-50/40' : 'hover:bg-gray-50/60'
                          }`}
                        >
                          {/* STT */}
                          <td className="text-center py-4 px-4 text-gray-500">{idx + 1}</td>

                          {/* Content summary */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadgeCls(report.type)}`}>
                                {typeLabel(report.type)}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(report.status)}`}>
                                {statusLabel(report.status)}
                              </span>
                            </div>
                            <p className="text-gray-800 line-clamp-2">
                              {language === 'jp' ? report.titleJP : report.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {language === 'jp' ? report.cafeNameJP : report.cafeName}
                            </p>
                          </td>

                          {/* Date & Time */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="flex items-center gap-1 text-gray-700">
                                <Calendar className="size-3.5 text-gray-400" />
                                {date}
                              </span>
                              <span className="flex items-center gap-1 text-gray-400 text-xs">
                                <Clock className="size-3 text-gray-300" />
                                {time}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {/* Xem chi tiết — always shown */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-500"
                                onClick={() => { setSelectedReport(report); setDetailOpen(true); }}
                              >
                                <Eye className="size-3.5 mr-1" />
                                {language === 'jp' ? '詳細' : 'Xem chi tiết'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t bg-gray-50/60 text-sm text-gray-500 flex items-center justify-between">
              <span>
                {language === 'jp'
                  ? `総レポート数：${filtered.length}`
                  : `Tổng số báo cáo: ${filtered.length}`}
                {filtered.length !== reports.length && (
                  <span className="ml-2 text-gray-400">
                    {language === 'jp'
                      ? `（全${reports.length}件中）`
                      : `(trong tổng ${reports.length})`}
                  </span>
                )}
              </span>
              <span className="text-orange-600 font-medium">
                {activeReports} {language === 'jp' ? '件未処理' : 'chờ xử lý'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Detail Modal ══ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedReport && (() => {
            const { date, time } = fmtDateTime(selectedReport.createdAt);
            const isNew = selectedReport.status === 'active';
            return (
              <div className="space-y-5">
                <DialogHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadgeCls(selectedReport.type)}`}>
                      {typeLabel(selectedReport.type)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(selectedReport.status)}`}>
                      {statusLabel(selectedReport.status)}
                    </span>
                  </div>
                  <DialogTitle>
                    {language === 'jp' ? selectedReport.titleJP : selectedReport.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Meta info */}
                <div className="bg-gray-50 rounded-lg divide-y text-sm">
                  <DetailRow
                    icon={<Store className="size-4 text-gray-400" />}
                    label={language === 'jp' ? '対象カフェ' : 'Quán liên quan'}
                    value={language === 'jp' ? selectedReport.cafeNameJP : selectedReport.cafeName}
                  />
                  <DetailRow
                    icon={<User className="size-4 text-gray-400" />}
                    label={language === 'jp' ? '報告者' : 'Người gửi'}
                    value={selectedReport.reporterName}
                  />
                  <DetailRow
                    icon={<ChevronRight className="size-4 text-gray-400" />}
                    label={language === 'jp' ? '対象' : 'Đối tượng'}
                    value={language === 'jp' ? selectedReport.targetInfoJP : selectedReport.targetInfo}
                  />
                  <DetailRow
                    icon={<Calendar className="size-4 text-gray-400" />}
                    label={language === 'jp' ? '受信日時' : 'Ngày & Giờ nhận'}
                    value={`${date} · ${time}`}
                  />
                </div>

                {/* Full description */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {language === 'jp' ? '詳細内容' : 'Nội dung chi tiết'}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border">
                    {language === 'jp' ? selectedReport.descriptionJP : selectedReport.description}
                  </div>
                </div>

                {/* Action buttons */}
                {isNew ? (
                  <div className="flex gap-3 pt-1">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => { handleAction(selectedReport.id, 'resolved'); }}
                    >
                      <CheckCircle className="size-4 mr-2" />
                      {language === 'jp' ? '承認する' : 'Chấp thuận'}
                    </Button>
                    <Button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => { handleAction(selectedReport.id, 'rejected'); }}
                    >
                      <XCircle className="size-4 mr-2" />
                      {language === 'jp' ? '却下する' : 'Từ chối'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full text-gray-500 border-gray-300 cursor-default opacity-70"
                  >
                    ✓ {language === 'jp' ? '処理済み' : 'Đã xử lý'}
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={() => setDetailOpen(false)}>
                  {language === 'jp' ? '閉じる' : 'Đóng'}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value ?? '-'}</span>
    </div>
  );
}
