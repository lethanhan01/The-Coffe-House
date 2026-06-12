"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageController = void 0;
const storageService_1 = require("../services/storageService");
const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: 'No file uploaded',
            });
        }
        const imageUrl = await (0, storageService_1.uploadCafeImage)(file);
        return res.status(200).json({
            url: imageUrl,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message,
        });
    }
};
exports.uploadImageController = uploadImageController;
//# sourceMappingURL=uploadController.js.map