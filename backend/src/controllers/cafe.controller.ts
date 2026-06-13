import { Request, Response } from 'express';
import * as cafeService from '../services/cafe.service';

//API: truy xuat tat ca quan
export const getCafes = async (req: Request, res: Response) => {
    try {
        const cafes = await cafeService.getAllCafes();

        res.status(200).json({ success: true, count: cafes.length, data: cafes });
    } catch (error) {
        console.error("Lỗi lấy danh sách quán:", error);
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
};
//API: tim kiem va loc quan
export const searchCafes = async (req: Request, res: Response) => {
    try {
        const q = req.query as Record<string, string>;
        const filters: any = {
            keyword:      q.keyword,
            isOpen:       q.is_open       || q.isOpen,
            isCrowded:    q.is_crowded    || q.isCrowded,
            minRating:    q.min_rating    || q.minRating,
            hasWifi:      q.has_wifi      || q.hasWifi,
            hasAc:        q.has_ac        || q.hasAc,
            hasOutlets:   q.has_outlets   || q.hasOutlets,
            isNonSmoking: q.is_non_smoking || q.isNonSmoking,
            isQuiet:      q.is_quiet      || q.isQuiet,
            hasSnacks:    q.has_snacks    || q.hasSnacks,
            sortBy:       q.sort_by       || q.sortBy,
            limit:        q.limit,
            offset:       q.offset,
        };

        console.log("Search filters:", filters);

        const cafes = await cafeService.searchCafes(filters);

        res.status(200).json({
            success: true,
            count: cafes.length,
            data: cafes
        });
    } catch (error: any) {
        console.error("Lỗi tìm kiếm/lọc quán: ", error);

        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ",
            error: error.message
        });
    }
};

// API: Lấy chi tiết một quán (GET)
export const getCafeById = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.id as string);
        const cafe = await cafeService.getCafeById(cafeId);

        if (!cafe) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán cafe" });
        }
        res.status(200).json({ success: true, data: cafe });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server nội bộ" });
    }
};

export const createCafe = async (req: Request, res: Response) => {
    try {
        const newCafeId = await cafeService.createCafe(req.body);
        res.status(201).json({ success: true, message: "Tạo quán thành công", data: { id: newCafeId } });
    } catch (error) {
        console.error("Lỗi tạo quán:", error);
        res.status(500).json({ success: false, message: "Lỗi khi lưu vào DB" });
    }
};

export const updateCafe = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.id as string);
        const isUpdated = await cafeService.updateCafe(cafeId, req.body);

        if (!isUpdated) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán để cập nhật" });
        }
        res.status(200).json({ success: true, message: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật" });
    }
};

export const requestCafeDeletion = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.id as string);
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
    } catch (error: any) {
        console.error('Lỗi gửi yêu cầu xóa quán:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi khi gửi yêu cầu xóa quán' });
    }
};

// API: Xóa quán (DELETE)
export const deleteCafe = async (req: Request, res: Response) => {
    try {
        const cafeId = parseInt(req.params.id as string);
        const isDeleted = await cafeService.deleteCafe(cafeId);

        if (!isDeleted) {
            return res.status(404).json({ success: false, message: "Không tìm thấy quán để xóa" });
        }
        res.status(200).json({ success: true, message: "Đã xóa quán khỏi hệ thống" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa" });
    }
};