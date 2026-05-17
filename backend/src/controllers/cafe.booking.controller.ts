import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import * as emailService from '../services/email.service';
import supabase from '../utils/db';

// API: Tạo booking mới
export const createBooking = async (req: Request, res: Response) => {
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
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', newBooking.user_id)
            .single();

        // Fetch cafe details for email
        const { data: cafeData, error: cafeError } = await supabase
            .from('cafes')
            .select('name_vn, name_jp, address, phone_number')
            .eq('id', newBooking.cafe_id)
            .single();

        // Send confirmation email if both user and cafe data are available
        if (userData && cafeData) {
            const cafeName = userData.full_name?.includes('日本') || userData.full_name?.includes('にほ') 
                ? cafeData.name_jp 
                : cafeData.name_vn;
            
            await emailService.sendBookingConfirmationEmail(
                userData.email,
                userData.full_name,
                cafeName,
                newBooking.booking_date,
                newBooking.booking_time,
                newBooking.number_of_people,
                cafeData.address,
                cafeData.phone_number,
                newBooking.id,
                'vi' // Default to Vietnamese, can be enhanced to detect user preference
            );
        }

        res.status(201).json({ 
            success: true, 
            message: "Tạo đặt chỗ thành công", 
            data: newBooking 
        });
    } catch (error: any) {
        console.error("Lỗi tạo booking:", error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Lỗi khi tạo đặt chỗ" 
        });
    }
};

// API: Lấy tất cả booking của một người dùng
export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId as string);
        
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
    } catch (error: any) {
        console.error("Lỗi lấy booking của người dùng:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server nội bộ" 
        });
    }
};

// API: Lấy tất cả booking của một quán
export const getCafeBookings = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.cafeId as string);
        
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
    } catch (error: any) {
        console.error("Lỗi lấy booking của quán:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server nội bộ" 
        });
    }
};

// API: Lấy chi tiết một booking
export const getBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id as string);
        
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
    } catch (error: any) {
        console.error("Lỗi lấy chi tiết booking:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server nội bộ" 
        });
    }
};

// API: Cập nhật trạng thái booking
export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id as string);
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
        
        res.status(200).json({ 
            success: true, 
            message: "Cập nhật trạng thái thành công",
            data: updatedBooking 
        });
    } catch (error: any) {
        console.error("Lỗi cập nhật trạng thái booking:", error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Lỗi khi cập nhật trạng thái" 
        });
    }
};

// API: Hủy booking
export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id as string);

        if (!bookingId || isNaN(bookingId)) {
            return res.status(400).json({ 
                success: false, 
                message: "ID booking không hợp lệ" 
            });
        }

        // Get booking details before canceling
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*, users(email, full_name), cafes(name_vn)')
            .eq('id', bookingId)
            .single();

        const result = await bookingService.cancelBooking(bookingId);

        // Send cancellation email if booking data available
        if (bookingData && bookingData.users) {
            await emailService.sendBookingCancellationEmail(
                bookingData.users.email,
                bookingData.users.full_name,
                bookingData.cafes?.name_vn || 'Quán Cafe',
                bookingId,
                'vi'
            );
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Hủy đặt chỗ thành công"
        });
    } catch (error: any) {
        console.error("Lỗi hủy booking:", error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Lỗi khi hủy đặt chỗ" 
        });
    }
};

// API: Lấy booking theo ngày và quán (kiểm tra tính khả dụng)
export const getBookingsByDateAndCafe = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.cafeId as string);
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

        const bookings = await bookingService.getBookingsByDateAndCafe(cafeId, bookingDate as string);
        
        res.status(200).json({ 
            success: true, 
            count: bookings.length,
            data: bookings 
        });
    } catch (error: any) {
        console.error("Lỗi lấy booking theo ngày:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server nội bộ" 
        });
    }
};
