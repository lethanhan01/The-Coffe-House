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
export const searchCafes = async(re: Request, res: Response) => {
    try{
        const filters = re.query;
        const cafes = await cafeService.searchCafes(filters);

        res.status(200).json({
            success: true,
            count: cafes.length,
            data:cafes
        });
    } catch(error){
        console.error("Lỗi tìm kiếm/lọc quán: ",error);

        res.status(500).json({
            success: true,
            message: "Lỗi server nội bộ"
        })
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