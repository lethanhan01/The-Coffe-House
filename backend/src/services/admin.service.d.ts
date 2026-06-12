export interface AdminUser {
    id: number;
    full_name: string;
    email: string;
    phone_number?: string | null;
    avatar_url: string | null;
    role_id: number;
}
export interface AdminReport {
    id: string;
    type: 'review_complaint' | 'cafe_delete';
    status: 'active' | 'resolved' | 'rejected';
    title: string;
    title_jp: string;
    description: string;
    description_jp: string;
    cafe_id: number | null;
    reporter_id: number | null;
    cafe_name: string | null;
    cafe_name_jp: string | null;
    reporter_name: string | null;
    target_info: string | null;
    target_info_jp: string | null;
    created_at: string;
}
export interface AdminStats {
    totalUsers: number;
    totalCafes: number;
    totalReports: number;
    activeReports: number;
}
export declare const getAllUsers: () => Promise<AdminUser[]>;
export declare const getAllReports: () => Promise<AdminReport[]>;
export declare const updateReportStatus: (reportId: string | number, status: "resolved" | "rejected") => Promise<boolean>;
export declare const getAdminStats: () => Promise<AdminStats>;
//# sourceMappingURL=admin.service.d.ts.map