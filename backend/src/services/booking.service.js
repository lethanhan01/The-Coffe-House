"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsByDateAndCafe = exports.cancelBooking = exports.updateBookingStatus = exports.getBookingById = exports.getCafeBookings = exports.getUserBookings = exports.createBooking = void 0;
const db_1 = __importDefault(require("../utils/db"));
// 1. CREATE: Tạo booking mới
const createBooking = async (data) => {
    const { user_id, cafe_id, booking_date, booking_time, number_of_people } = data;
    // Kiểm tra thông tin bắt buộc
    if (!user_id || !cafe_id || !booking_date || !booking_time || !number_of_people) {
        throw new Error('Thiếu thông tin yêu cầu');
    }
    const { data: bookingResult, error: bookingError } = await db_1.default
        .from('bookings')
        .insert([{
            user_id,
            cafe_id,
            booking_date,
            booking_time,
            number_of_people,
            status: 'pending'
        }])
        .select('*')
        .single();
    if (bookingError)
        throw new Error(bookingError.message);
    return bookingResult;
};
exports.createBooking = createBooking;
// 2. READ: Lấy tất cả booking của một người dùng
const getUserBookings = async (userId) => {
    const { data, error } = await db_1.default
        .from('bookings')
        .select('*, cafes(name_vn, name_jp, address, phone_number)')
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data || [];
};
exports.getUserBookings = getUserBookings;
// 3. READ: Lấy tất cả booking của một quán cafe
const getCafeBookings = async (cafeId) => {
    const { data, error } = await db_1.default
        .from('bookings')
        .select('*, users(full_name, email, phone_number)')
        .eq('cafe_id', cafeId)
        .order('booking_date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data || [];
};
exports.getCafeBookings = getCafeBookings;
// 4. READ: Lấy chi tiết một booking
const getBookingById = async (bookingId) => {
    const { data, error } = await db_1.default
        .from('bookings')
        .select('*, users(full_name, email, phone_number), cafes(name_vn, name_jp, address)')
        .eq('id', bookingId)
        .single();
    if (error && error.code !== 'PGRST116')
        throw new Error(error.message);
    return data || null;
};
exports.getBookingById = getBookingById;
// 5. UPDATE: Cập nhật trạng thái booking
const updateBookingStatus = async (bookingId, status) => {
    const supportedStatuses = ['pending', 'confirmed', 'approved', 'rejected'];
    if (!supportedStatuses.includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
    }
    const tryStatusUpdate = async (statusValue) => {
        const { data, error } = await db_1.default
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
exports.updateBookingStatus = updateBookingStatus;
// 6. DELETE: Hủy booking
const cancelBooking = async (bookingId) => {
    const { error } = await db_1.default
        .from('bookings')
        .delete()
        .eq('id', bookingId);
    if (error)
        throw new Error(error.message);
    return true;
};
exports.cancelBooking = cancelBooking;
// 7. READ: Lấy booking theo ngày và quán (để kiểm tra tính khả dụng)
const getBookingsByDateAndCafe = async (cafeId, bookingDate) => {
    const { data, error } = await db_1.default
        .from('bookings')
        .select('*')
        .eq('cafe_id', cafeId)
        .eq('booking_date', bookingDate)
        .in('status', ['pending', 'confirmed']);
    if (error)
        throw new Error(error.message);
    return data || [];
};
exports.getBookingsByDateAndCafe = getBookingsByDateAndCafe;
//# sourceMappingURL=booking.service.js.map