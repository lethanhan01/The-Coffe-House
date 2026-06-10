import supabase from '../utils/db';

// 1. CREATE: Tạo booking mới
export const createBooking = async (data: any) => {
    const { user_id, cafe_id, booking_date, booking_time, number_of_people } = data;
    const bookingLanguage = data.language === 'jp' ? 'jp' : 'vi';

    // Kiểm tra thông tin bắt buộc
    if (!user_id || !cafe_id || !booking_date || !booking_time || !number_of_people) {
        throw new Error('Thiếu thông tin yêu cầu');
    }

    const { data: bookingResult, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
            user_id,
            cafe_id,
            booking_date,
            booking_time,
            number_of_people,
            status: 'pending',
            language: bookingLanguage
        }])
        .select('*')
        .single();

    if (bookingError) throw new Error(bookingError.message);

    return bookingResult;
};

// 2. READ: Lấy tất cả booking của một người dùng
export const getUserBookings = async (userId: number) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, cafes(name_vn, name_jp, address, phone_number)')
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });

    if (error) throw new Error(error.message);

    return data || [];
};

// 3. READ: Lấy tất cả booking của một quán cafe
export const getCafeBookings = async (cafeId: number) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, users(full_name, email, phone_number)')
        .eq('cafe_id', cafeId)
        .order('booking_date', { ascending: false });
    if (error) throw new Error(error.message);

    return data || [];
};

// 4. READ: Lấy chi tiết một booking
export const getBookingById = async (bookingId: number) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, users(full_name, email, phone_number), cafes(name_vn, name_jp, address)')
        .eq('id', bookingId)
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);

    return data || null;
};

// 5. UPDATE: Cập nhật trạng thái booking
export const updateBookingStatus = async (bookingId: number, status: string) => {
    const supportedStatuses = ['pending', 'confirmed', 'approved', 'rejected'];
    if (!supportedStatuses.includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
    }

    const tryStatusUpdate = async (statusValue: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: statusValue })
            .eq('id', bookingId)
            .select('*')
            .single();

        return { data, error };
    };

    const primaryStatus = status === 'confirmed' ? 'confirmed' : status;
    let result = await tryStatusUpdate(primaryStatus);

    if (result.error) {
        const fallbackStatus = status === 'confirmed' ? 'approved' : status === 'approved' ? 'confirmed' : null;
        if (fallbackStatus) {
            const fallbackResult = await tryStatusUpdate(fallbackStatus);
            if (!fallbackResult.error) {
                return fallbackResult.data;
            }
        }

        throw new Error(result.error.message);
    }

    return result.data;
};

// 6. DELETE: Hủy booking
export const cancelBooking = async (bookingId: number) => {
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) throw new Error(error.message);

    return true;
};

// 7. READ: Lấy booking theo ngày và quán (để kiểm tra tính khả dụng)
export const getBookingsByDateAndCafe = async (cafeId: number, bookingDate: string) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('cafe_id', cafeId)
        .eq('booking_date', bookingDate)
        .in('status', ['pending', 'confirmed']);

    if (error) throw new Error(error.message);

    return data || [];
};
