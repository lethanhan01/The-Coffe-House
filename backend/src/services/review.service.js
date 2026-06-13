"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewReport = exports.createReview = exports.getReviewsByCafeId = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getReviewsByCafeId = async (cafe_id) => {
    // Lấy các review đã bị report và approved
    const { data: reportedReviews } = await db_1.default
        .from('review_reports')
        .select('review_id')
        .eq('status', 'approved');
    const excludedIds = reportedReviews?.map(r => r.review_id) || [];
    // Lấy review, loại bỏ các review trên
    const { data, error } = await db_1.default
        .from('reviews')
        .select(`
        id,
        cafe_id,
        user_id,
        rating,
        comment,
        created_at,
        users (full_name, avatar_url),
        review_images (image_url)
    `)
        .eq('cafe_id', cafe_id)
        .not('id', 'in', `(${excludedIds.join(',')})`)
        .order('created_at', { ascending: false });
    // const { data, error } = await supabase
    //     .from('reviews')
    //     .select(`
    //         id,
    //         cafe_id,
    //         user_id,
    //         rating,
    //         comment,
    //         created_at,
    //         users (full_name, avatar_url),
    //         review_images (image_url)
    //     `)
    //     .eq('cafe_id', cafe_id)
    //     .order('created_at', { ascending: false });
    if (error)
        throw new Error(`Failed to fetch reviews: ${error.message}`);
    return (data || []).map((r) => ({
        id: r.id,
        cafe_id: r.cafe_id,
        user_id: r.user_id,
        userName: r.users?.full_name || 'Anonymous',
        avatarUrl: r.users?.avatar_url || null,
        rating: Math.min(5, Math.max(1, Number(r.rating))),
        comment: r.comment || '',
        createdAt: r.created_at,
        images: (r.review_images || []).map((img) => img.image_url),
    }));
};
exports.getReviewsByCafeId = getReviewsByCafeId;
const createReview = async (reviewData) => {
    const { cafe_id, user_id, rating, comment, image_urls } = reviewData;
    // 1. Insert review
    const { data: review, error: reviewError } = await db_1.default
        .from('reviews')
        .insert([{ cafe_id, user_id, rating, comment }])
        .select('id')
        .single();
    if (reviewError)
        throw new Error(`Failed to insert review: ${reviewError.message}`);
    const newReviewId = review.id;
    // 2. Insert images if provided
    if (image_urls && image_urls.length > 0) {
        const imagePayloads = image_urls.map(url => ({
            review_id: newReviewId,
            image_url: url
        }));
        const { error: imageError } = await db_1.default
            .from('review_images')
            .insert(imagePayloads);
        if (imageError)
            throw new Error(`Failed to insert review images: ${imageError.message}`);
    }
    // 3. Recalculate average_rating and update review_count
    // Lấy toàn bộ reviews của cafe_id
    const { data: allReviews, error: fetchError } = await db_1.default
        .from('reviews')
        .select('rating')
        .eq('cafe_id', cafe_id);
    if (fetchError)
        throw new Error(`Failed to fetch reviews for recalculation: ${fetchError.message}`);
    const review_count = allReviews.length;
    let average_rating = 0;
    if (review_count > 0) {
        // Clamp từng rating về [1, 5] để tránh data dirty ảnh hưởng kết quả
        const totalRating = allReviews.reduce((sum, r) => {
            const clampedRating = Math.min(5, Math.max(1, Number(r.rating)));
            return sum + clampedRating;
        }, 0);
        average_rating = totalRating / review_count;
        // Làm tròn 2 chữ số thập phân, đảm bảo không vượt quá 5
        average_rating = Math.min(5, Math.round(average_rating * 100) / 100);
    }
    // 4. Update the cafe
    const { error: updateCafeError } = await db_1.default
        .from('cafes')
        .update({ review_count, average_rating })
        .eq('id', cafe_id);
    if (updateCafeError)
        throw new Error(`Failed to update cafe stats: ${updateCafeError.message}`);
    return {
        id: newReviewId,
        cafe_id,
        user_id,
        rating,
        comment,
        image_urls: image_urls || [],
        new_cafe_average_rating: average_rating,
        new_cafe_review_count: review_count
    };
};
exports.createReview = createReview;
const createReviewReport = async (reportData) => {
    const { review_id, reporter_id, reason, detail } = reportData;
    const status = 'pending'; // Mặc định trạng thái là pending khi tạo mới
    const { data: report, error: reportError } = await db_1.default
        .from('review_reports')
        .insert([{ review_id, reporter_id, reason, detail, status }])
        .select('id')
        .single();
    if (reportError)
        throw new Error(`Failed to insert review report: ${reportError.message}`);
    return report;
};
exports.createReviewReport = createReviewReport;
//# sourceMappingURL=review.service.js.map