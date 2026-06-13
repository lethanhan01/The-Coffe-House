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
exports.updateReportStatus = exports.getReports = exports.getUsers = exports.getAdminStats = void 0;
const adminService = __importStar(require("../services/admin.service"));
const getAdminStats = async (req, res) => {
    try {
        const stats = await adminService.getAdminStats();
        res.status(200).json({ success: true, data: stats });
    }
    catch (error) {
        console.error('Lỗi lấy thống kê admin:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};
exports.getAdminStats = getAdminStats;
const getUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        console.error('Lỗi lấy danh sách người dùng:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};
exports.getUsers = getUsers;
const getReports = async (req, res) => {
    try {
        const reports = await adminService.getAllReports();
        res.status(200).json({ success: true, data: reports });
    }
    catch (error) {
        console.error('Lỗi lấy danh sách báo cáo:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};
exports.getReports = getReports;
const updateReportStatus = async (req, res) => {
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
    }
    catch (error) {
        console.error('Lỗi cập nhật trạng thái báo cáo:', error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};
exports.updateReportStatus = updateReportStatus;
//# sourceMappingURL=admin.controller.js.map