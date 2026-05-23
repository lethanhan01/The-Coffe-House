import supabase from '../utils/db';

// Helper function to transform snake_case to camelCase
const transformPromotion = (data: any) => {
    if (!data) return null;
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
const transformPromotions = (dataArray: any[]) => {
    return dataArray.map(transformPromotion);
};

// 1. CREATE: Tạo promotion mới
export const createPromotion = async (data: any) => {
    const { cafe_id, title, title_jp, description, description_jp, image_url, valid_until } = data;

    // Kiểm tra thông tin bắt buộc
    if (!cafe_id || !title || !title_jp || !description || !description_jp || !valid_until) {
        throw new Error('Thiếu thông tin yêu cầu');
    }

    const { data: promotionResult, error: promotionError } = await supabase
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

    if (promotionError) throw new Error(promotionError.message);

    return transformPromotion(promotionResult);
};

// 2. READ: Lấy tất cả promotion của một quán cafe
export const getCafePromotions = async (cafeId: number) => {
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('cafe_id', cafeId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return transformPromotions(data || []);
};

// 3. READ: Lấy tất cả promotion hiện tại (chưa hết hạn)
export const getActivePromotions = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .gte('valid_until', today)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return transformPromotions(data || []);
};

// 4. READ: Lấy chi tiết một promotion
export const getPromotionById = async (promotionId: number) => {
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', promotionId)
        .single();

    if (error) throw new Error(error.message);

    return transformPromotion(data);
};

// 5. READ: Lấy promotion active của một quán
export const getCafeActivePromotions = async (cafeId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('cafe_id', cafeId)
        .gte('valid_until', today)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return transformPromotions(data || []);
};

// 6. UPDATE: Cập nhật promotion
export const updatePromotion = async (promotionId: number, data: any) => {
    const { title, title_jp, description, description_jp, image_url, valid_until } = data;

    const { data: updatedPromotion, error } = await supabase
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

    if (error) throw new Error(error.message);

    return transformPromotion(updatedPromotion);
};

// 7. DELETE: Xóa promotion
export const deletePromotion = async (promotionId: number) => {
    const { data, error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId)
        .select('*')
        .single();

    if (error) throw new Error(error.message);

    return transformPromotion(data);
};
