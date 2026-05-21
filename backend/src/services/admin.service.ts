import supabase from '../utils/db';
import * as cafeService from './cafe.service';

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

let reportTableCache: 'review_reports' | null = null;

const getReportTableName = async (): Promise<'review_reports'> => {
    if (reportTableCache) return reportTableCache;
    reportTableCache = 'review_reports';
    return 'review_reports';
};

const CAFE_DELETE_REPORT_PREFIX = 'cafe_delete:';
const buildCafeDeleteReportId = (cafeId: number) => `${CAFE_DELETE_REPORT_PREFIX}${cafeId}`;
const isCafeDeleteReportId = (reportId: string) => reportId.startsWith(CAFE_DELETE_REPORT_PREFIX);
const parseCafeDeleteReportId = (reportId: string) => parseInt(reportId.slice(CAFE_DELETE_REPORT_PREFIX.length), 10);

const fetchCafeDeleteReports = async (): Promise<AdminReport[]> => {
    const { data: cafes, error: cafesError } = await supabase
        .from('cafes')
        .select('id, owner_id, name_vn, name_jp, deletion_reason, deletion_request_status, updated_at')
        .in('deletion_request_status', ['pending', 'approved', 'rejected']);

    if (cafesError) {
        throw new Error(cafesError.message);
    }

    const reporterIds = Array.from(
        new Set((cafes || []).map((cafe: any) => cafe.owner_id).filter(Boolean))
    );

    const reporterMap: Record<number, string> = {};
    if (reporterIds.length > 0) {
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', reporterIds);
        if (usersError) throw new Error(usersError.message);
        (users || []).forEach((user: any) => {
            reporterMap[user.id] = user.full_name;
        });
    }

    return (cafes || []).map((cafe: any) => {
        const status = cafe.deletion_request_status === 'pending'
            ? 'active'
            : cafe.deletion_request_status === 'approved'
                ? 'resolved'
                : 'rejected';

        return {
            id: buildCafeDeleteReportId(cafe.id),
            type: 'cafe_delete',
            status,
            title: cafe.name_vn ? `Yêu cầu xóa quán: ${cafe.name_vn}` : 'Yêu cầu xóa quán',
            title_jp: cafe.name_jp ? `カフェ削除依頼：${cafe.name_jp}` : 'カフェ削除依頼',
            description: cafe.deletion_reason ?? '',
            description_jp: cafe.deletion_reason ?? '',
            cafe_id: cafe.id,
            reporter_id: cafe.owner_id ?? null,
            cafe_name: cafe.name_vn ?? null,
            cafe_name_jp: cafe.name_jp ?? null,
            reporter_name: reporterMap[cafe.owner_id] ?? null,
            target_info: `Cafe ID: ${cafe.id}`,
            target_info_jp: `カフェID：${cafe.id}`,
            created_at: cafe.updated_at ?? '',
        };
    });
};

export interface AdminStats {
    totalUsers: number;
    totalCafes: number;
    totalReports: number;
    activeReports: number;
}

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url, role_id, phone_number')
        .order('id', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role_id: user.role_id,
        phone_number: user.phone_number,
    }));
};

const fetchReviewReports = async (): Promise<AdminReport[]> => {
    const { data: reports, error: reportsError } = await supabase
        .from('review_reports')
        .select('id, review_id, reporter_id, reason, detail, status, created_at')
        .order('created_at', { ascending: false });

    if (reportsError) {
        throw new Error(reportsError.message);
    }

    const reporterIds = Array.from(
        new Set((reports || []).map((report: any) => report.reporter_id).filter(Boolean))
    );
    const reviewIds = Array.from(
        new Set((reports || []).map((report: any) => report.review_id).filter(Boolean))
    );

    const reporterMap: Record<number, string> = {};
    if (reporterIds.length > 0) {
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', reporterIds);
        if (usersError) throw new Error(usersError.message);
        (users || []).forEach((user: any) => {
            reporterMap[user.id] = user.full_name;
        });
    }

    const reviewMap: Record<number, number> = {};
    if (reviewIds.length > 0) {
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('id, cafe_id')
            .in('id', reviewIds);
        if (reviewsError) throw new Error(reviewsError.message);
        (reviews || []).forEach((review: any) => {
            reviewMap[review.id] = review.cafe_id;
        });
    }

    const cafeIds = Array.from(new Set(Object.values(reviewMap).filter(Boolean)));
    const cafeMap: Record<number, { name_vn: string; name_jp: string }> = {};
    if (cafeIds.length > 0) {
        const { data: cafes, error: cafesError } = await supabase
            .from('cafes')
            .select('id, name_vn, name_jp')
            .in('id', cafeIds);
        if (cafesError) throw new Error(cafesError.message);
        (cafes || []).forEach((cafe: any) => {
            cafeMap[cafe.id] = { name_vn: cafe.name_vn, name_jp: cafe.name_jp };
        });
    }

    return (reports || []).map((report: any) => {
        const reviewId = report.review_id;
        const cafeId = reviewId ? reviewMap[reviewId] ?? null : null;
        const cafe = cafeId ? cafeMap[cafeId] : null;
        const status = report.status === 'approved'
            ? 'resolved'
            : report.status === 'pending'
                ? 'active'
                : 'rejected';

        return {
            id: report.id,
            type: 'review_complaint',
            status,
            title: report.reason ?? 'Review complaint',
            title_jp: report.reason ?? 'レビュー苦情',
            description: report.detail ?? '',
            description_jp: report.detail ?? '',
            cafe_id: cafeId,
            reporter_id: report.reporter_id ?? null,
            cafe_name: cafe?.name_vn ?? null,
            cafe_name_jp: cafe?.name_jp ?? null,
            reporter_name: reporterMap[report.reporter_id] ?? null,
            target_info: reviewId ? `Review ID: ${reviewId}` : null,
            target_info_jp: reviewId ? `レビューID: ${reviewId}` : null,
            created_at: report.created_at ?? '',
        };
    });
};

export const getAllReports = async (): Promise<AdminReport[]> => {
    const reviewReports = await fetchReviewReports();
    let cafeDeleteReports: AdminReport[] = [];

    try {
        cafeDeleteReports = await fetchCafeDeleteReports();
    } catch (error: any) {
        console.warn('Cafe delete reports unavailable:', error?.message || error);
    }

    return [...reviewReports, ...cafeDeleteReports].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
    });
};

export const updateReportStatus = async (
    reportId: string | number,
    status: 'resolved' | 'rejected'
): Promise<boolean> => {
    const reportIdString = String(reportId);
    if (isCafeDeleteReportId(reportIdString)) {
        const cafeId = parseCafeDeleteReportId(reportIdString);
        if (Number.isNaN(cafeId)) {
            throw new Error('Invalid cafe delete report id');
        }

        if (status === 'resolved') {
            // Admin approved the delete request: remove the cafe completely.
            await cafeService.deleteCafe(cafeId);
            return true;
        }

        const { error } = await supabase
            .from('cafes')
            .update({
                deletion_request_status: 'rejected',
                deletion_requested: false,
            })
            .eq('id', cafeId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    const reportTable = await getReportTableName();
    const updatedStatus = reportTable === 'review_reports'
        ? status === 'resolved' ? 'approved' : 'rejected'
        : status;

    const { error } = await supabase
        .from(reportTable)
        .update({ status: updatedStatus })
        .eq('id', Number(reportId));

    if (error) {
        throw new Error(error.message);
    }

    return true;
};

export const getAdminStats = async (): Promise<AdminStats> => {
    const [usersResult, cafesResult, reviewReportsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('cafes').select('id', { count: 'exact', head: true }),
        supabase.from('review_reports').select('id', { count: 'exact', head: true }),
    ]);

    if (usersResult.error) throw new Error(usersResult.error.message);
    if (cafesResult.error) throw new Error(cafesResult.error.message);
    if (reviewReportsResult.error) throw new Error(reviewReportsResult.error.message);

    const totalUsers = usersResult.count ?? 0;
    const totalCafes = cafesResult.count ?? 0;
    const totalReviewReports = reviewReportsResult.count ?? 0;

    let totalCafeDeleteReports = 0;
    let activeCafeDeleteReports = 0;
    let reviewActiveReports = 0;

    try {
        const cafeDeleteCountResult = await supabase
            .from('cafes')
            .select('id', { count: 'exact', head: true })
            .in('deletion_request_status', ['pending', 'approved', 'rejected']);

        if (cafeDeleteCountResult.error) {
            throw cafeDeleteCountResult.error;
        }

        totalCafeDeleteReports = cafeDeleteCountResult.count ?? 0;

        const activeCafeDeleteCountResult = await supabase
            .from('cafes')
            .select('id', { count: 'exact', head: true })
            .eq('deletion_request_status', 'pending');

        if (activeCafeDeleteCountResult.error) {
            throw activeCafeDeleteCountResult.error;
        }

        activeCafeDeleteReports = activeCafeDeleteCountResult.count ?? 0;
    } catch (error: any) {
        console.warn('Cafe delete stats unavailable:', error?.message || error);
    }

    try {
        const activeReviewCountResult = await supabase
            .from('review_reports')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (activeReviewCountResult.error) {
            throw activeReviewCountResult.error;
        }

        reviewActiveReports = activeReviewCountResult.count ?? 0;
    } catch (error: any) {
        console.warn('Review active stats unavailable:', error?.message || error);
    }

    return {
        totalUsers,
        totalCafes,
        totalReports: totalReviewReports + totalCafeDeleteReports,
        activeReports: reviewActiveReports + activeCafeDeleteReports,
    };
};
