const API_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role_id: number;
  role: 1 | 2 | 3 | 4;
}

export interface AdminReport {
  id: string;
  type: 'review_complaint' | 'cafe_delete';
  status: 'active' | 'resolved' | 'rejected';
  title: string;
  titleJP: string;
  description: string;
  descriptionJP: string;
  cafeId: string | null;
  reporterId: string | null;
  cafeName: string | null;
  cafeNameJP: string | null;
  reporterName: string | null;
  targetInfo: string | null;
  targetInfoJP: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCafes: number;
  totalReports: number;
  activeReports: number;
}

const getAuthToken = () => localStorage.getItem('token');

const getHeaders = (contentType = true) => {
  const headers: HeadersInit = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getHeaders(false)
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<AdminUser[] | null> => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders(false)
    });
    if (!response.ok) return null;
    const result = await response.json();
    return Array.isArray(result.data)
      ? result.data.map((user: any) => ({
          id: String(user.id),
          name: user.full_name,
          email: user.email,
          phone: user.phone_number ?? null,
          avatar_url: user.avatar_url,
          role_id: user.role_id,
          role: user.role_id,
        }))
      : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

export const getAllReports = async (): Promise<AdminReport[] | null> => {
  try {
    const response = await fetch(`${API_URL}/admin/reports`, {
      headers: getHeaders(false)
    });
    if (!response.ok) {
      const responseBody = await response.text();
      console.error('Error fetching reports:', response.status, response.statusText, responseBody);
      throw new Error(`Failed to fetch reports: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    return Array.isArray(result.data)
      ? result.data.map((report: any) => ({
          id: String(report.id),
          type: report.type,
          status: report.status,
          title: report.title,
          titleJP: report.title_jp,
          description: report.description,
          descriptionJP: report.description_jp,
          cafeId: report.cafe_id ? String(report.cafe_id) : null,
          reporterId: report.reporter_id ? String(report.reporter_id) : null,
          cafeName: report.cafe_name ?? null,
          cafeNameJP: report.cafe_name_jp ?? null,
          reporterName: report.reporter_name ?? null,
          targetInfo: report.target_info ?? null,
          targetInfoJP: report.target_info_jp ?? null,
          createdAt: report.created_at ?? '',
        }))
      : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return null;
  }
};

export const updateReportStatus = async (
  reportId: string,
  status: 'resolved' | 'rejected'
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating report status:', error);
    return false;
  }
};
