import { Request, Response } from 'express';
import * as promotionService from '../services/promotion.service';
import supabase from '../utils/db';

// API: Tạo promotion mới
export const createPromotion = async (req: Request, res: Response) => {
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
        const { data: cafeData, error: cafeError } = await supabase
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
    } catch (error: any) {
        console.error("Create promotion error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi tạo khuyến mãi" 
        });
    }
};

// API: Lấy tất cả promotion của một quán
export const getCafePromotions = async (req: Request, res: Response) => {
    try {
        const cafeId = req.params.cafeId as string;
        
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
    } catch (error: any) {
        console.error("Get cafe promotions error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi lấy khuyến mãi" 
        });
    }
};

// API: Lấy tất cả promotion hiện tại (chưa hết hạn)
export const getActivePromotions = async (req: Request, res: Response) => {
    try {
        const promotions = await promotionService.getActivePromotions();
        
        res.status(200).json({ 
            success: true, 
            data: promotions 
        });
    } catch (error: any) {
        console.error("Get active promotions error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi lấy khuyến mãi" 
        });
    }
};

// API: Lấy promotion active của một quán
export const getCafeActivePromotions = async (req: Request, res: Response) => {
    try {
        const cafeId = req.params.cafeId as string;
        
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
    } catch (error: any) {
        console.error("Get cafe active promotions error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi lấy khuyến mãi" 
        });
    }
};

// API: Lấy chi tiết một promotion
export const getPromotionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        
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
    } catch (error: any) {
        console.error("Get promotion by id error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi lấy khuyến mãi" 
        });
    }
};

// API: Cập nhật promotion
export const updatePromotion = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
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
    } catch (error: any) {
        console.error("Update promotion error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi cập nhật khuyến mãi" 
        });
    }
};

// API: Xóa promotion
export const deletePromotion = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        
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
    } catch (error: any) {
        console.error("Delete promotion error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi xóa khuyến mãi" 
        });
    }
};
