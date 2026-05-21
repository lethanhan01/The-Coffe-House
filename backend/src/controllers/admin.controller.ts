import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getAdminStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
        console.error('Lỗi lấy thống kê admin:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        console.error('Lỗi lấy danh sách người dùng:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await adminService.getAllReports();
        res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
        console.error('Lỗi lấy danh sách báo cáo:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};

export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const reportIdParam = req.params.id;
        if (!reportIdParam || Array.isArray(reportIdParam)) {
            return res.status(400).json({ success: false, message: 'Id báo cáo không hợp lệ' });
        }

        const { status } = req.body;

        if (!['resolved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
        }

        await adminService.updateReportStatus(reportIdParam, status);
        res.status(200).json({ success: true, message: 'Cập nhật trạng thái báo cáo thành công' });
    } catch (error: any) {
        console.error('Lỗi cập nhật trạng thái báo cáo:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};
