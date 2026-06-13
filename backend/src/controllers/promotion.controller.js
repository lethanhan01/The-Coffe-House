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
exports.deletePromotion = exports.updatePromotion = exports.getPromotionById = exports.getCafeActivePromotions = exports.getActivePromotions = exports.getCafePromotions = exports.createPromotion = void 0;
const promotionService = __importStar(require("../services/promotion.service"));
const db_1 = __importDefault(require("../utils/db"));
// API: Tạo promotion mới
const createPromotion = async (req, res) => {
    try {
        console.log("Create promotion request body:", req.body);
        const promotionData = req.body;
        if (!promotionData || Object.keys(promotionData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body trống. Vui lòng gửi dữ liệu JSON."
            });
        }
        // Kiểm tra xem cafe có tồn tại không
        const { data: cafeData, error: cafeError } = await db_1.default
            .from('cafes')
            .select('id')
            .eq('id', promotionData.cafe_id)
            .single();
        if (cafeError || !cafeData) {
            return res.status(404).json({
                success: false,
                message: "Quán cafe không tồn tại"
            });
        }
        const newPromotion = await promotionService.createPromotion(promotionData);
        res.status(201).json({
            success: true,
            message: "Tạo khuyến mãi thành công",
            data: newPromotion
        });
    }
    catch (error) {
        console.error("Create promotion error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi tạo khuyến mãi"
        });
    }
};
exports.createPromotion = createPromotion;
// API: Lấy tất cả promotion của một quán
const getCafePromotions = async (req, res) => {
    try {
        const cafeId = req.params.cafeId;
        if (!cafeId) {
            return res.status(400).json({
                success: false,
                message: "cafeId là bắt buộc"
            });
        }
        const promotions = await promotionService.getCafePromotions(parseInt(cafeId));
        res.status(200).json({
            success: true,
            data: promotions
        });
    }
    catch (error) {
        console.error("Get cafe promotions error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi lấy khuyến mãi"
        });
    }
};
exports.getCafePromotions = getCafePromotions;
// API: Lấy tất cả promotion hiện tại (chưa hết hạn)
const getActivePromotions = async (req, res) => {
    try {
        const promotions = await promotionService.getActivePromotions();
        res.status(200).json({
            success: true,
            data: promotions
        });
    }
    catch (error) {
        console.error("Get active promotions error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi lấy khuyến mãi"
        });
    }
};
exports.getActivePromotions = getActivePromotions;
// API: Lấy promotion active của một quán
const getCafeActivePromotions = async (req, res) => {
    try {
        const cafeId = req.params.cafeId;
        if (!cafeId) {
            return res.status(400).json({
                success: false,
                message: "cafeId là bắt buộc"
            });
        }
        const promotions = await promotionService.getCafeActivePromotions(parseInt(cafeId));
        res.status(200).json({
            success: true,
            data: promotions
        });
    }
    catch (error) {
        console.error("Get cafe active promotions error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi lấy khuyến mãi"
        });
    }
};
exports.getCafeActivePromotions = getCafeActivePromotions;
// API: Lấy chi tiết một promotion
const getPromotionById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id là bắt buộc"
            });
        }
        const promotion = await promotionService.getPromotionById(parseInt(id));
        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: "Khuyến mãi không tồn tại"
            });
        }
        res.status(200).json({
            success: true,
            data: promotion
        });
    }
    catch (error) {
        console.error("Get promotion by id error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi lấy khuyến mãi"
        });
    }
};
exports.getPromotionById = getPromotionById;
// API: Cập nhật promotion
const updatePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id là bắt buộc"
            });
        }
        // Kiểm tra xem promotion có tồn tại không
        const existingPromotion = await promotionService.getPromotionById(parseInt(id));
        if (!existingPromotion) {
            return res.status(404).json({
                success: false,
                message: "Khuyến mãi không tồn tại"
            });
        }
        const updatedPromotion = await promotionService.updatePromotion(parseInt(id), updateData);
        res.status(200).json({
            success: true,
            message: "Cập nhật khuyến mãi thành công",
            data: updatedPromotion
        });
    }
    catch (error) {
        console.error("Update promotion error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi cập nhật khuyến mãi"
        });
    }
};
exports.updatePromotion = updatePromotion;
// API: Xóa promotion
const deletePromotion = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id là bắt buộc"
            });
        }
        // Kiểm tra xem promotion có tồn tại không
        const existingPromotion = await promotionService.getPromotionById(parseInt(id));
        if (!existingPromotion) {
            return res.status(404).json({
                success: false,
                message: "Khuyến mãi không tồn tại"
            });
        }
        await promotionService.deletePromotion(parseInt(id));
        res.status(200).json({
            success: true,
            message: "Xóa khuyến mãi thành công"
        });
    }
    catch (error) {
        console.error("Delete promotion error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi xóa khuyến mãi"
        });
    }
};
exports.deletePromotion = deletePromotion;
//# sourceMappingURL=promotion.controller.js.map