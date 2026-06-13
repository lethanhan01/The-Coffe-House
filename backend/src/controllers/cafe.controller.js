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
exports.deleteCafe = exports.requestCafeDeletion = exports.updateCafe = exports.createCafe = exports.getCafeById = exports.searchCafes = exports.getCafes = void 0;
const cafeService = __importStar(require("../services/cafe.service"));
//API: truy xuat tat ca quan
const getCafes = async (req, res) => {
    try {
        const cafes = await cafeService.getAllCafes();
        res.status(200).json({ success: true, count: cafes.length, data: cafes });
    }
    catch (error) {
        console.error("Lỗi lấy danh sách quán:", error);
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
};
exports.getCafes = getCafes;
//API: tim kiem va loc quan
const searchCafes = async (req, res) => {
    try {
        const filters = req.query;
        // Log filters for debugging
        console.log("Search filters:", filters);
        const cafes = await cafeService.searchCafes(filters);
        res.status(200).json({
            success: true,
            count: cafes.length,
            data: cafes
        });
    }
    catch (error) {
        console.error("Lỗi tìm kiếm/lọc quán: ", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ",
            error: error.message
        });
    }
};
exports.searchCafes = searchCafes;
// API: Lấy chi tiết một quán (GET)
const getCafeById = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const cafe = await cafeService.getCafeById(cafeId);
        if (!cafe) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán cafe" });
        }
        res.status(200).json({ success: true, data: cafe });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
};
exports.getCafeById = getCafeById;
const createCafe = async (req, res) => {
    try {
        const newCafeId = await cafeService.createCafe(req.body);
        res.status(201).json({ success: true, message: "Tạo quán thành công", data: { id: newCafeId } });
    }
    catch (error) {
        console.error("Lỗi tạo quán:", error);
        res.status(500).json({ success: false, message: "Lỗi khi lưu vào DB" });
    }
};
exports.createCafe = createCafe;
const updateCafe = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const isUpdated = await cafeService.updateCafe(cafeId, req.body);
        if (!isUpdated) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán để cập nhật" });
        }
        res.status(200).json({ success: true, message: "Cập nhật thành công" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật" });
    }
};
exports.updateCafe = updateCafe;
const requestCafeDeletion = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const ownerId = req.user?.id;
        const { reason } = req.body;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: 'Không có quyền thực hiện hành động này' });
        }
        if (!reason || typeof reason !== 'string' || !reason.trim()) {
            return res.status(400).json({ success: false, message: 'Lý do yêu cầu xóa quán không được để trống' });
        }
        const result = await cafeService.requestCafeDeletion(cafeId, ownerId, reason.trim());
        if (!result) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy quán hoặc bạn không có quyền' });
        }
        res.status(200).json({ success: true, message: 'Yêu cầu xóa quán đã gửi thành công' });
    }
    catch (error) {
        console.error('Lỗi gửi yêu cầu xóa quán:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi khi gửi yêu cầu xóa quán' });
    }
};
exports.requestCafeDeletion = requestCafeDeletion;
// API: Xóa quán (DELETE)
const deleteCafe = async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const isDeleted = await cafeService.deleteCafe(cafeId);
        if (!isDeleted) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán để xóa" });
        }
        res.status(200).json({ success: true, message: "Đã xóa quán khỏi hệ thống" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa" });
    }
};
exports.deleteCafe = deleteCafe;
//# sourceMappingURL=cafe.controller.js.map