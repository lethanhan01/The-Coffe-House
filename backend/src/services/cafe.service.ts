import supabase from '../utils/db';
import { Cafe } from '../models/Cafe';
// 1. READ: Lấy danh sách quán 
export const getAllCafes = async () => {
    const { data, error } = await supabase
        .from('cafes')
        .select('*, amenities(*), menus(*)');

    if (error) throw new Error(error.message);
    return (data || []).map(mapCafeFromDB);

    // return data.map((cafe: any) => {
    //     const { amenities, ...cafeData } = cafe;
    //     const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
    //     return { ...cafeData, ...(amenityObj || {}) };
    // });
};
export const mapCafeFromDB = (data: any): Cafe => {
    return {
        id: String(data.id),
        owner_id: String(data.owner_id),
        name: data.name_vn,

        nameJP: data.name_jp,

        address: data.address,

        phone: data.phone_number,

        // Vì DB đang là string nên tự convert sang array
        openingHours: data.open_hours
            ? [
                {
                    day: 'Mon-Sun',
                    hours: data.open_hours
                }
            ]
            : [],

        isOpen: data.is_open,

        status: data.is_crowded ? 'crowded' : 'normal',

        amenities: {
            hasWifi: data.amenities?.has_wifi ?? false,

            hasAC: data.amenities?.has_ac ?? false,

            hasOutlet: data.amenities?.has_outlets ?? false,

            noSmoking: data.amenities?.is_non_smoking ?? false,

            hasSnacks: data.amenities?.has_snacks ?? false,

            // Có menu cafe => true
            hasCoffee: data.amenities?.has_high_tables ?? false,
        },

        menu: (data.menus || []).map((item: any) => ({
            id: String(item.id),

            name: item.name,

            nameJP: item.nameJP || '',

            price: item.price,

            category: item.category || 'General',

            image: item.image || undefined
        })),

        rating: data.average_rating ?? 0,

        reviewCount: data.review_count ?? 0,

        images: data.cover_image_url
            ? [data.cover_image_url]
            : [],

        lat: Number(data.lat ?? data.latitude ?? 0),
        lng: Number(data.lng ?? data.longitude ?? 0)
    };
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
    return cafe ? mapCafeFromDB(cafe) : null;
    // const { amenities, menus, ...cafeData } = cafe;
    // const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;

    // return {
    //     ...cafeData,
    //     ...(amenityObj || {}),
    //     menus: menus || []
    // };
};

// 3. CREATE: Thêm quán mới (Kèm tiện ích mặc định)
interface CreateCafeInput {
    owner_id: number;
    name_jp: string;
    name_vn: string;
    address: string;
    phone_number: string;
    open_hours?: string;
    cover_image_url?: string;
    place_id?: string | number;
    lat?: number;
    lng?: number;

    amenities?: {
        has_wifi?: boolean;
        has_ac?: boolean;
        has_outlets?: boolean;
        is_non_smoking?: boolean;
        has_snacks?: boolean;
        has_high_tables?: boolean;
        is_quiet?: boolean;
    };
}

export const createCafe = async (
    data: CreateCafeInput
): Promise<number> => {

    const {
        amenities,
        ...cafeData
    } = data;

    // Insert cafe
    const { data: cafeResult, error: cafeError } = await supabase
        .from('cafes')
        .insert([cafeData])
        .select('id')
        .single();

    if (cafeError) {
        throw new Error(cafeError.message);
    }

    const newCafeId = cafeResult.id;

    // Insert amenities
    const { error: amenityError } = await supabase
        .from('amenities')
        .insert([
            {
                cafe_id: newCafeId,
                ...amenities
            }
        ]);

    if (amenityError) {
        throw new Error(amenityError.message);
    }

    return newCafeId;
};
// export const createCafe = async (data: any) => {
//     const { owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url } = data;

//     const { data: cafeResult, error: cafeError } = await supabase
//         .from('cafes')
//         .insert([{ owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url }])
//         .select('id')
//         .single();

//     if (cafeError) throw new Error(cafeError.message);

//     const newCafeId = cafeResult.id;

//     const { error: amenityError } = await supabase
//         .from('amenities')
//         .insert([{ cafe_id: newCafeId }]);

//     if (amenityError) throw new Error(amenityError.message);

//     return newCafeId;
// };
// 4. UPDATE: Cập nhật thông tin quán (Mở cửa, Đóng cửa, Đổi tên, Đổi địa chỉ, Cập nhật tiện ích)
export interface UpdateCafeInput {
    name_jp?: string;
    name_vn?: string;
    address?: string;
    phone_number?: string;
    cover_image_url?: string;

    is_open?: boolean;
    is_crowded?: boolean;
    amenities?: {
        has_ac?: boolean;
        has_wifi?: boolean;
        has_snacks?: boolean;
        has_outlets?: boolean;
        is_non_smoking?: boolean;
        has_high_tables?: boolean;
    };
}

export const updateCafe = async (
    cafeId: number,
    updateData: UpdateCafeInput
) => {
    const payload: any = {};

    // Basic fields
    if (updateData.name_jp !== undefined)
        payload.name_jp = updateData.name_jp;

    if (updateData.name_vn !== undefined)
        payload.name_vn = updateData.name_vn;

    if (updateData.address !== undefined)
        payload.address = updateData.address;

    if (updateData.phone_number !== undefined)
        payload.phone_number = updateData.phone_number;

    if (updateData.cover_image_url !== undefined)
        payload.cover_image_url = updateData.cover_image_url;

    // Status fields
    if (updateData.is_open !== undefined)
        payload.is_open = updateData.is_open;

    if (updateData.is_crowded !== undefined)
        payload.is_crowded = updateData.is_crowded;

    // Amenities
    if (updateData.amenities !== undefined)
        payload.amenities = updateData.amenities;

    // Nothing to update
    if (Object.keys(payload).length === 0) {
        return false;
    }
    const { amenities, ...cafeData } = payload;

    const { error } = await supabase
        .from('cafes')
        .update(cafeData)
        .eq('id', cafeId);
    if (error) {
        throw new Error(error.message);
    }
    const { error: amenityError } = await supabase
        .from('amenities')
        .update(amenities)
        .eq('cafe_id', cafeId);

    if (amenityError) {
        throw new Error(amenityError.message);
    }


    return true;
};
// export const updateCafe = async (cafeId: number, updateData: any) => {
//     const { is_open, is_crowded } = updateData;

//     const payload: any = {};
//     if (is_open !== undefined) payload.is_open = is_open;
//     if (is_crowded !== undefined) payload.is_crowded = is_crowded;

//     if (Object.keys(payload).length === 0) return false;

//     const { error } = await supabase
//         .from('cafes')
//         .update(payload)
//         .eq('id', cafeId);

//     if (error) throw new Error(error.message);
//     return true;
// };

export const deleteCafe = async (cafeId: number) => {
    const { error } = await supabase
        .from('cafes')
        .delete()
        .eq('id', cafeId);

    if (error) throw new Error(error.message);
    return true;
};

// SEARCH&FILTER: tìm kiếm và lọc quán cafe
export const searchCafes = async (filters: any) => {
    try {
        let selectString = '*, amenities(*)';

        // Start with base query
        let query = supabase.from('cafes').select(selectString);

        // 1. SEARCH by keyword (tên quán, địa chỉ)
        if (filters.keyword && filters.keyword.trim()) {
            const keyword = filters.keyword.trim();
            query = query.or(
                `name_jp.ilike.%${keyword}%,name_vn.ilike.%${keyword}%,address.ilike.%${keyword}%`
            );
        }

        // 2. FILTER by status (mở cửa)
        if (filters.isOpen === 'true') {
            query = query.eq('is_open', true);
        }

        // 3. FILTER by crowded status
        if (filters.isCrowded === 'true') {
            query = query.eq('is_crowded', true);
        } else if (filters.isCrowded === 'false') {
            query = query.eq('is_crowded', false);
        }

        // 4. FILTER by rating (cần rating >= giá trị)
        if (filters.minRating) {
            const minRating = parseFloat(filters.minRating);
            if (!isNaN(minRating)) {
                query = query.gte('average_rating', minRating);
            }
        }

        // 5. FILTER by amenities
        // WiFi filter
        if (filters.hasWifi === 'true') {
            selectString = '*, amenities!inner(*)';
            query = supabase.from('cafes').select(selectString);
            query = query.eq('amenities.has_wifi', true);
        }

        // AC filter
        if (filters.hasAc === 'true') {
            if (filters.hasWifi !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.has_ac', true);
        }

        // Outlets filter
        if (filters.hasOutlets === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.has_outlets', true);
        }

        // Non-smoking filter
        if (filters.isNonSmoking === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true' && filters.hasOutlets !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.is_non_smoking', true);
        }

        // Quiet filter
        if (filters.isQuiet === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true' &&
                filters.hasOutlets !== 'true' && filters.isNonSmoking !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.is_quiet', true);
        }

        // 6. SORTING
        let orderBy = 'id';
        let ascending = true;

        if (filters.sortBy === 'rating') {
            orderBy = 'average_rating';
            ascending = false; // Sort by highest rating first
        } else if (filters.sortBy === 'name') {
            orderBy = 'name_vn';
            ascending = true;
        } else if (filters.sortBy === 'newest') {
            orderBy = 'id';
            ascending = false;
        }

        query = query.order(orderBy, { ascending });

        // 7. PAGINATION (optional)
        const limit = parseInt(filters.limit) || 20;
        const offset = parseInt(filters.offset) || 0;

        if (limit > 0) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        // Format response data
        return data.map((cafe: any) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    } catch (error) {
        throw error;
    }
};
