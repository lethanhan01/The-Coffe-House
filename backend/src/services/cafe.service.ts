import supabase from '../utils/db';

// 1. READ: Lấy danh sách quán 
export const getAllCafes = async () => {
    const { data, error } = await supabase
        .from('cafes')
        .select('*, amenities(*)');

    if (error) throw new Error(error.message);

    return data.map((cafe: any) => {
        const { amenities, ...cafeData } = cafe;
        const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
        return { ...cafeData, ...(amenityObj || {}) };
    });
};

// 2. READ: Lấy chi tiết 1 quán kèm Menu và Amenities (Phục vụ P_ID 4 và Màn hình ID 10)
export const getCafeById = async (cafeId: number) => {
    const { data: cafe, error } = await supabase
        .from('cafes')
        .select('*, amenities(*), menus(*)')
        .eq('id', cafeId)
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!cafe) return null;

    const { amenities, menus, ...cafeData } = cafe;
    const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
    
    return {
        ...cafeData,
        ...(amenityObj || {}),
        menus: menus || []
    };
};

// 3. CREATE: Thêm quán mới (Kèm tiện ích mặc định)
export const createCafe = async (data: any) => {
    const { owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url } = data;

    const { data: cafeResult, error: cafeError } = await supabase
        .from('cafes')
        .insert([{ owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url }])
        .select('id')
        .single();

    if (cafeError) throw new Error(cafeError.message);

    const newCafeId = cafeResult.id;

    const { error: amenityError } = await supabase
        .from('amenities')
        .insert([{ cafe_id: newCafeId }]);

    if (amenityError) throw new Error(amenityError.message);

    return newCafeId;
};

export const updateCafe = async (cafeId: number, updateData: any) => {
    const { is_open, is_crowded } = updateData;
    
    const payload: any = {};
    if (is_open !== undefined) payload.is_open = is_open;
    if (is_crowded !== undefined) payload.is_crowded = is_crowded;

    if (Object.keys(payload).length === 0) return false;

    const { error } = await supabase
        .from('cafes')
        .update(payload)
        .eq('id', cafeId);

    if (error) throw new Error(error.message);
    return true;
};

export const deleteCafe = async (cafeId: number) => {
    const { error } = await supabase
        .from('cafes')
        .delete()
        .eq('id', cafeId);

    if (error) throw new Error(error.message);
    return true;
};

// SEARCH&FILTER: tìm kiếm và lọc
export const searchCafes = async (filters: any) => {
    let selectString = '*, amenities(*)';

    // If there are strict amenity filters, we require inner join so we don't return cafes without matching amenities.
    if (filters.has_wifi === 'true' || filters.is_quiet === 'true' || filters.has_ac === 'true' || filters.has_outlets === 'true') {
        selectString = '*, amenities!inner(*)';
    }

    let query = supabase.from('cafes').select(selectString);

    if (filters.keyword) {
        query = query.or(`name_jp.ilike.%${filters.keyword}%,name_vn.ilike.%${filters.keyword}%,address.ilike.%${filters.keyword}%`);
    }

    // Logic lọc theo tiện ích
    if (filters.has_wifi === 'true') { query = query.eq('amenities.has_wifi', true); }
    if (filters.is_quiet === 'true') { query = query.eq('amenities.is_quiet', true); }
    if (filters.has_ac === 'true') { query = query.eq('amenities.has_ac', true); }
    if (filters.has_outlets === 'true') { query = query.eq('amenities.has_outlets', true); }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data.map((cafe: any) => {
        const { amenities, ...cafeData } = cafe;
        const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
        return { ...cafeData, ...(amenityObj || {}) };
    });
};
