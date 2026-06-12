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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController = __importStar(require("../controllers/cafe.booking.controller"));
const router = (0, express_1.Router)();
// Booking management endpoints
// 1. POST: Tạo booking mới
router.post('/', bookingController.createBooking);
// 2. GET: Lấy tất cả booking của một người dùng (MUST BE BEFORE /:id)
router.get('/user/:userId', bookingController.getUserBookings);
// 3. GET: Lấy tất cả booking của một quán (MUST BE BEFORE /:id)
router.get('/cafe/:cafeId', bookingController.getCafeBookings);
// 4. GET: Lấy booking theo ngày và quán (kiểm tra tính khả dụng - MUST BE BEFORE /:id)
// Usage: /api/bookings/availability/cafe/1?bookingDate=2026-05-20
router.get('/availability/cafe/:cafeId', bookingController.getBookingsByDateAndCafe);
// 5. GET: Lấy chi tiết một booking (MUST BE LAST)
router.get('/:id', bookingController.getBookingById);
// 6. PUT: Cập nhật trạng thái booking
router.put('/:id/status', bookingController.updateBookingStatus);
// 7. DELETE: Hủy booking
router.delete('/:id', bookingController.cancelBooking);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map