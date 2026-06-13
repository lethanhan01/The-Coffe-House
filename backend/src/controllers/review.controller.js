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
exports.createReviewReport = exports.createReviewHandler = exports.getReviewsHandler = void 0;
const reviewService = __importStar(require("../services/review.service"));
const getReviewsHandler = async (req, res) => {
    try {
        const cafe_id = parseInt(req.query.cafe_id);
        if (!cafe_id || isNaN(cafe_id)) {
            return res.status(400).json({ error: 'Missing or invalid cafe_id query param' });
        }
        const reviews = await reviewService.getReviewsByCafeId(cafe_id);
        res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
exports.getReviewsHandler = getReviewsHandler;
const createReviewHandler = async (req, res) => {
    try {
        const { cafe_id, rating, comment, image_urls } = req.body;
        // Auth check is handled by middleware, so req.user exists
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!cafe_id || rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields: cafe_id or rating' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        const result = await reviewService.createReview({
            cafe_id,
            user_id,
            rating,
            comment,
            image_urls
        });
        res.status(201).json({
            message: 'Review submitted successfully',
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
exports.createReviewHandler = createReviewHandler;
const createReviewReport = async (req, res) => {
    try {
        const { review_id, reason, detail } = req.body;
        const reporter_id = req.user?.id;
        if (!reporter_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!review_id || !reason || !detail) {
            return res.status(400).json({ error: 'Missing required fields: review_id, reason, or detail' });
        }
        const result = await reviewService.createReviewReport({
            review_id,
            reporter_id,
            reason,
            detail
        });
        res.status(201).json({
            message: 'Review report submitted successfully',
            data: result,
            scuccess: true
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message || 'Internal server error',
            success: false
        });
    }
};
exports.createReviewReport = createReviewReport;
//# sourceMappingURL=review.controller.js.map