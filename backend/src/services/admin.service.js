"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.updateReportStatus = exports.getAllReports = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../utils/db"));
const cafeService = __importStar(require("./cafe.service"));
let reportTableCache = null;
const getReportTableName = async () => {
    if (reportTableCache)
        return reportTableCache;
    reportTableCache = 'review_reports';
    return 'review_reports';
};
const CAFE_DELETE_REPORT_PREFIX = 'cafe_delete:';
const buildCafeDeleteReportId = (cafeId) => `${CAFE_DELETE_REPORT_PREFIX}${cafeId}`;
const isCafeDeleteReportId = (reportId) => reportId.startsWith(CAFE_DELETE_REPORT_PREFIX);
const parseCafeDeleteReportId = (reportId) => parseInt(reportId.slice(CAFE_DELETE_REPORT_PREFIX.length), 10);
const fetchCafeDeleteReports = async () => {
    const { data: cafes, error: cafesError } = await db_1.default
        .from('cafes')
        .select('id, owner_id, name_vn, name_jp, deletion_reason, deletion_request_status, updated_at')
        .in('deletion_request_status', ['pending', 'approved', 'rejected']);
    if (cafesError) {
        throw new Error(cafesError.message);
    }
    const reporterIds = Array.from(new Set((cafes || []).map((cafe) => cafe.owner_id).filter(Boolean)));
    const reporterMap = {};
    if (reporterIds.length > 0) {
        const { data: users, error: usersError } = await db_1.default
            .from('users')
            .select('id, full_name')
            .in('id', reporterIds);
        if (usersError)
            throw new Error(usersError.message);
        (users || []).forEach((user) => {
            reporterMap[user.id] = user.full_name;
        });
    }
    return (cafes || []).map((cafe) => {
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
const getAllUsers = async () => {
    const { data, error } = await db_1.default
        .from('users')
        .select('id, full_name, email, avatar_url, role_id, phone_number')
        .order('id', { ascending: true });
    if (error) {
        throw new Error(error.message);
    }
    return (data || []).map((user) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role_id: user.role_id,
        phone_number: user.phone_number,
    }));
};
exports.getAllUsers = getAllUsers;
const fetchReviewReports = async () => {
    const { data: reports, error: reportsError } = await db_1.default
        .from('review_reports')
        .select('id, review_id, reporter_id, reason, detail, status, created_at')
        .order('created_at', { ascending: false });
    if (reportsError) {
        throw new Error(reportsError.message);
    }
    const reporterIds = Array.from(new Set((reports || []).map((report) => report.reporter_id).filter(Boolean)));
    const reviewIds = Array.from(new Set((reports || []).map((report) => report.review_id).filter(Boolean)));
    const reporterMap = {};
    if (reporterIds.length > 0) {
        const { data: users, error: usersError } = await db_1.default
            .from('users')
            .select('id, full_name')
            .in('id', reporterIds);
        if (usersError)
            throw new Error(usersError.message);
        (users || []).forEach((user) => {
            reporterMap[user.id] = user.full_name;
        });
    }
    const reviewMap = {};
    if (reviewIds.length > 0) {
        const { data: reviews, error: reviewsError } = await db_1.default
            .from('reviews')
            .select('id, cafe_id')
            .in('id', reviewIds);
        if (reviewsError)
            throw new Error(reviewsError.message);
        (reviews || []).forEach((review) => {
            reviewMap[review.id] = review.cafe_id;
        });
    }
    const cafeIds = Array.from(new Set(Object.values(reviewMap).filter(Boolean)));
    const cafeMap = {};
    if (cafeIds.length > 0) {
        const { data: cafes, error: cafesError } = await db_1.default
            .from('cafes')
            .select('id, name_vn, name_jp')
            .in('id', cafeIds);
        if (cafesError)
            throw new Error(cafesError.message);
        (cafes || []).forEach((cafe) => {
            cafeMap[cafe.id] = { name_vn: cafe.name_vn, name_jp: cafe.name_jp };
        });
    }
    return (reports || []).map((report) => {
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
const getAllReports = async () => {
    const reviewReports = await fetchReviewReports();
    let cafeDeleteReports = [];
    try {
        cafeDeleteReports = await fetchCafeDeleteReports();
    }
    catch (error) {
        console.warn('Cafe delete reports unavailable:', error?.message || error);
    }
    return [...reviewReports, ...cafeDeleteReports].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
    });
};
exports.getAllReports = getAllReports;
const updateReportStatus = async (reportId, status) => {
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
        const { error } = await db_1.default
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
    const { error } = await db_1.default
        .from(reportTable)
        .update({ status: updatedStatus })
        .eq('id', Number(reportId));
    if (error) {
        throw new Error(error.message);
    }
    return true;
};
exports.updateReportStatus = updateReportStatus;
const getAdminStats = async () => {
    const [usersResult, cafesResult, reviewReportsResult] = await Promise.all([
        db_1.default.from('users').select('id', { count: 'exact', head: true }),
        db_1.default.from('cafes').select('id', { count: 'exact', head: true }),
        db_1.default.from('review_reports').select('id', { count: 'exact', head: true }),
    ]);
    if (usersResult.error)
        throw new Error(usersResult.error.message);
    if (cafesResult.error)
        throw new Error(cafesResult.error.message);
    if (reviewReportsResult.error)
        throw new Error(reviewReportsResult.error.message);
    const totalUsers = usersResult.count ?? 0;
    const totalCafes = cafesResult.count ?? 0;
    const totalReviewReports = reviewReportsResult.count ?? 0;
    let totalCafeDeleteReports = 0;
    let activeCafeDeleteReports = 0;
    let reviewActiveReports = 0;
    try {
        const cafeDeleteCountResult = await db_1.default
            .from('cafes')
            .select('id', { count: 'exact', head: true })
            .in('deletion_request_status', ['pending', 'approved', 'rejected']);
        if (cafeDeleteCountResult.error) {
            throw cafeDeleteCountResult.error;
        }
        totalCafeDeleteReports = cafeDeleteCountResult.count ?? 0;
        const activeCafeDeleteCountResult = await db_1.default
            .from('cafes')
            .select('id', { count: 'exact', head: true })
            .eq('deletion_request_status', 'pending');
        if (activeCafeDeleteCountResult.error) {
            throw activeCafeDeleteCountResult.error;
        }
        activeCafeDeleteReports = activeCafeDeleteCountResult.count ?? 0;
    }
    catch (error) {
        console.warn('Cafe delete stats unavailable:', error?.message || error);
    }
    try {
        const activeReviewCountResult = await db_1.default
            .from('review_reports')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');
        if (activeReviewCountResult.error) {
            throw activeReviewCountResult.error;
        }
        reviewActiveReports = activeReviewCountResult.count ?? 0;
    }
    catch (error) {
        console.warn('Review active stats unavailable:', error?.message || error);
    }
    return {
        totalUsers,
        totalCafes,
        totalReports: totalReviewReports + totalCafeDeleteReports,
        activeReports: reviewActiveReports + activeCafeDeleteReports,
    };
};
exports.getAdminStats = getAdminStats;
//# sourceMappingURL=admin.service.js.map