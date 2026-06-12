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
exports.getBookingsByDateAndCafe = exports.cancelBooking = exports.updateBookingStatus = exports.getBookingById = exports.getCafeBookings = exports.getUserBookings = exports.createBooking = void 0;
const bookingService = __importStar(require("../services/booking.service"));
const emailService = __importStar(require("../services/email.service"));
const db_1 = __importDefault(require("../utils/db"));
// API: Tạo booking mới
const createBooking = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const bookingData = req.body;
        if (!bookingData || Object.keys(bookingData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body trống. Vui lòng gửi dữ liệu JSON."
            });
        }
        const newBooking = await bookingService.createBooking(bookingData);
        // Fetch user details for email
        const { data: userData, error: userError } = await db_1.default
            .from('users')
            .select('email, full_name')
            .eq('id', newBooking.user_id)
            .single();
        // Fetch cafe details for email
        const { data: cafeData, error: cafeError } = await db_1.default
            .from('cafes')
            .select('name_vn, name_jp, address, phone_number')
            .eq('id', newBooking.cafe_id)
            .single();
        // Send confirmation email if both user and cafe data are available
        if (userData && cafeData) {
            const cafeName = userData.full_name?.includes('日本') || userData.full_name?.includes('にほ')
                ? cafeData.name_jp
                : cafeData.name_vn;
            await emailService.sendBookingConfirmationEmail(userData.email, userData.full_name, cafeName, newBooking.booking_date, newBooking.booking_time, newBooking.number_of_people, cafeData.address, cafeData.phone_number, newBooking.id, 'vi' // Default to Vietnamese, can be enhanced to detect user preference
            );
        }
        res.status(201).json({
            success: true,
            message: "Tạo đặt chỗ thành công",
            data: newBooking
        });
    }
    catch (error) {
        console.error("Lỗi tạo booking:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Lỗi khi tạo đặt chỗ"
        });
    }
};
exports.createBooking = createBooking;
// API: Lấy tất cả booking của một người dùng
const getUserBookings = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "ID người dùng không hợp lệ"
            });
        }
        const bookings = await bookingService.getUserBookings(userId);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    }
    catch (error) {
        console.error("Lỗi lấy booking của người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ"
        });
    }
};
exports.getUserBookings = getUserBookings;
// API: Lấy tất cả booking của một quán
const getCafeBookings = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.cafeId);
        if (!cafeId || isNaN(cafeId)) {
            return res.status(400).json({
                success: false,
                message: "ID quán không hợp lệ"
            });
        }
        const bookings = await bookingService.getCafeBookings(cafeId);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    }
    catch (error) {
        console.error("Lỗi lấy booking của quán:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ"
        });
    }
};
exports.getCafeBookings = getCafeBookings;
// API: Lấy chi tiết một booking
const getBookingById = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.id);
        if (!bookingId || isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "ID booking không hợp lệ"
            });
        }
        const booking = await bookingService.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đặt chỗ"
            });
        }
        res.status(200).json({
            success: true,
            data: booking
        });
    }
    catch (error) {
        console.error("Lỗi lấy chi tiết booking:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ"
        });
    }
};
exports.getBookingById = getBookingById;
// API: Cập nhật trạng thái booking
const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.id);
        const { status } = req.body;
        if (!bookingId || isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "ID booking không hợp lệ"
            });
        }
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái là bắt buộc"
            });
        }
        const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
        if (status === 'confirmed' || status === 'approved' || status === 'rejected') {
            const { data: bookingData, error: bookingDataError } = await db_1.default
                .from('bookings')
                .select('*, users(email, full_name), cafes(name_vn, name_jp, address, phone_number)')
                .eq('id', bookingId)
                .single();
            if (bookingDataError) {
                console.warn('Không lấy được thông tin booking để gửi email:', bookingDataError.message);
            }
            else if (bookingData && bookingData.users) {
                const cafeName = bookingData.cafes?.name_vn || bookingData.cafes?.name_jp || 'Quán Cafe';
                await emailService.sendBookingStatusUpdateEmailToCustomer(bookingData.users.email, bookingData.users.full_name, cafeName, bookingData.booking_date, bookingData.booking_time, bookingData.number_of_people, status, bookingId, 'vi');
            }
        }
        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái thành công",
            data: updatedBooking
        });
    }
    catch (error) {
        console.error("Lỗi cập nhật trạng thái booking:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Lỗi khi cập nhật trạng thái"
        });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// API: Hủy booking
const cancelBooking = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.id);
        if (!bookingId || isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "ID booking không hợp lệ"
            });
        }
        // Get booking details before canceling
        const { data: bookingData, error: bookingError } = await db_1.default
            .from('bookings')
            .select('*, users(email, full_name), cafes(name_vn)')
            .eq('id', bookingId)
            .single();
        const result = await bookingService.cancelBooking(bookingId);
        // Send cancellation email if booking data available
        if (bookingData && bookingData.users) {
            await emailService.sendBookingCancellationEmail(bookingData.users.email, bookingData.users.full_name, bookingData.cafes?.name_vn || 'Quán Cafe', bookingId, 'vi');
        }
        res.status(200).json({
            success: true,
            message: "Hủy đặt chỗ thành công"
        });
    }
    catch (error) {
        console.error("Lỗi hủy booking:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Lỗi khi hủy đặt chỗ"
        });
    }
};
exports.cancelBooking = cancelBooking;
// API: Lấy booking theo ngày và quán (kiểm tra tính khả dụng)
const getBookingsByDateAndCafe = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.cafeId);
        const { bookingDate } = req.query;
        if (!cafeId || isNaN(cafeId)) {
            return res.status(400).json({
                success: false,
                message: "ID quán không hợp lệ"
            });
        }
        if (!bookingDate) {
            return res.status(400).json({
                success: false,
                message: "Ngày đặt chỗ là bắt buộc"
            });
        }
        const bookings = await bookingService.getBookingsByDateAndCafe(cafeId, bookingDate);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    }
    catch (error) {
        console.error("Lỗi lấy booking theo ngày:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ"
        });
    }
};
exports.getBookingsByDateAndCafe = getBookingsByDateAndCafe;
//# sourceMappingURL=cafe.booking.controller.js.map