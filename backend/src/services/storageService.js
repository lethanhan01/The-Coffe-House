"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCafeImage = void 0;
const storage_1 = require("../utils/storage");
const uploadCafeImage = async (file) => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
    const filePath = `cafes/${fileName}`;
    const { error } = await storage_1.supabase.storage
        .from('cafeImages')
        .upload(filePath, file.buffer, {
        contentType: file.mimetype,
    });
    if (error) {
        throw new Error(error.message);
    }
    const { data: { publicUrl }, } = storage_1.supabase.storage
        .from('cafeImages')
        .getPublicUrl(filePath);
    return publicUrl;
};
exports.uploadCafeImage = uploadCafeImage;
//# sourceMappingURL=storageService.js.map