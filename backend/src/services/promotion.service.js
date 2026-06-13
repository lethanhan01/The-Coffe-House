"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotion = exports.updatePromotion = exports.getCafeActivePromotions = exports.getPromotionById = exports.getActivePromotions = exports.getCafePromotions = exports.createPromotion = void 0;
const db_1 = __importDefault(require("../utils/db"));
// Helper function to transform snake_case to camelCase
const transformPromotion = (data) => {
    if (!data)
        return null;
    return {
        id: data.id,
        cafeId: data.cafe_id,
        title: data.title,
        titleJp: data.title_jp,
        description: data.description,
        descriptionJp: data.description_jp,
        imageUrl: data.image_url,
        validUntil: data.valid_until,
        createdAt: data.created_at,
    };
};
// Helper function to transform array of promotions
const transformPromotions = (dataArray) => {
    return dataArray.map(transformPromotion);
};
// 1. CREATE: Tạo promotion mới
const createPromotion = async (data) => {
    const { cafe_id, title, title_jp, description, description_jp, image_url, valid_until } = data;
    // Kiểm tra thông tin bắt buộc
    if (!cafe_id || !title || !title_jp || !description || !description_jp || !valid_until) {
        throw new Error('Thiếu thông tin yêu cầu');
    }
    const { data: promotionResult, error: promotionError } = await db_1.default
        .from('promotions')
        .insert([{
            cafe_id,
            title,
            title_jp,
            description,
            description_jp,
            image_url: image_url || null,
            valid_until
        }])
        .select('*')
        .single();
    if (promotionError)
        throw new Error(promotionError.message);
    return transformPromotion(promotionResult);
};
exports.createPromotion = createPromotion;
// 2. READ: Lấy tất cả promotion của một quán cafe
const getCafePromotions = async (cafeId) => {
    const { data, error } = await db_1.default
        .from('promotions')
        .select('*')
        .eq('cafe_id', cafeId)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return transformPromotions(data || []);
};
exports.getCafePromotions = getCafePromotions;
// 3. READ: Lấy tất cả promotion hiện tại (chưa hết hạn)
const getActivePromotions = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await db_1.default
        .from('promotions')
        .select('*')
        .gte('valid_until', today)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return transformPromotions(data || []);
};
exports.getActivePromotions = getActivePromotions;
// 4. READ: Lấy chi tiết một promotion
const getPromotionById = async (promotionId) => {
    const { data, error } = await db_1.default
        .from('promotions')
        .select('*')
        .eq('id', promotionId)
        .single();
    if (error)
        throw new Error(error.message);
    return transformPromotion(data);
};
exports.getPromotionById = getPromotionById;
// 5. READ: Lấy promotion active của một quán
const getCafeActivePromotions = async (cafeId) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await db_1.default
        .from('promotions')
        .select('*')
        .eq('cafe_id', cafeId)
        .gte('valid_until', today)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return transformPromotions(data || []);
};
exports.getCafeActivePromotions = getCafeActivePromotions;
// 6. UPDATE: Cập nhật promotion
const updatePromotion = async (promotionId, data) => {
    const { title, title_jp, description, description_jp, image_url, valid_until } = data;
    const { data: updatedPromotion, error } = await db_1.default
        .from('promotions')
        .update({
        ...(title && { title }),
        ...(title_jp && { title_jp }),
        ...(description && { description }),
        ...(description_jp && { description_jp }),
        ...(image_url && { image_url }),
        ...(valid_until && { valid_until })
    })
        .eq('id', promotionId)
        .select('*')
        .single();
    if (error)
        throw new Error(error.message);
    return transformPromotion(updatedPromotion);
};
exports.updatePromotion = updatePromotion;
// 7. DELETE: Xóa promotion
const deletePromotion = async (promotionId) => {
    const { data, error } = await db_1.default
        .from('promotions')
        .delete()
        .eq('id', promotionId)
        .select('*')
        .single();
    if (error)
        throw new Error(error.message);
    return transformPromotion(data);
};
exports.deletePromotion = deletePromotion;
//# sourceMappingURL=promotion.service.js.map