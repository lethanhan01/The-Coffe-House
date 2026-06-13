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
const promotionController = __importStar(require("../controllers/promotion.controller"));
const router = (0, express_1.Router)();
// Promotion management endpoints
// 1. POST: Tạo promotion mới
router.post('/', promotionController.createPromotion);
// 2. GET: Lấy tất cả promotion hiện tại (chưa hết hạn)
router.get('/active', promotionController.getActivePromotions);
// 3. GET: Lấy promotion active của một quán (MUST BE BEFORE /cafe/:cafeId)
router.get('/cafe/active/:cafeId', promotionController.getCafeActivePromotions);
// 4. GET: Lấy tất cả promotion của một quán (MUST BE BEFORE /:id)
router.get('/cafe/:cafeId', promotionController.getCafePromotions);
// 5. GET: Lấy chi tiết một promotion (MUST BE LAST)
router.get('/:id', promotionController.getPromotionById);
// 6. PUT: Cập nhật promotion
router.put('/:id', promotionController.updatePromotion);
// 7. DELETE: Xóa promotion
router.delete('/:id', promotionController.deletePromotion);
exports.default = router;
//# sourceMappingURL=promotion.routes.js.map