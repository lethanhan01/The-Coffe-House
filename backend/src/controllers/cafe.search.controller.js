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
exports.getOpenCafes = exports.getTrendingCafes = exports.filterByAmenities = exports.nearbySearch = exports.keywordSearch = exports.advancedSearch = void 0;
const cafeSearchService = __importStar(require("../services/cafe.search.service"));
/**
 * Advanced search endpoint
 */
const advancedSearch = async (req, res) => {
    try {
        const filters = {
            ...(req.query.keyword && { keyword: req.query.keyword }),
            ...(req.query.isOpen && { isOpen: req.query.isOpen }),
            ...(req.query.isCrowded && { isCrowded: req.query.isCrowded }),
            ...(req.query.minRating && { minRating: parseFloat(req.query.minRating) }),
            ...(req.query.hasWifi && { hasWifi: req.query.hasWifi }),
            ...(req.query.hasAc && { hasAc: req.query.hasAc }),
            ...(req.query.hasOutlets && { hasOutlets: req.query.hasOutlets }),
            ...(req.query.isNonSmoking && { isNonSmoking: req.query.isNonSmoking }),
            ...(req.query.isQuiet && { isQuiet: req.query.isQuiet }),
            ...(req.query.hasSnacks && { hasSnacks: req.query.hasSnacks }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy }),
            limit: req.query.limit ? parseInt(req.query.limit) : 20,
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
        };
        console.log('Advanced search filters:', filters);
        const results = await cafeSearchService.advancedSearch(filters);
        res.status(200).json({
            success: true,
            count: results.length,
            filters,
            data: results
        });
    }
    catch (error) {
        console.error('Error in advancedSearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm quán',
            error: error.message
        });
    }
};
exports.advancedSearch = advancedSearch;
/**
 * Keyword search endpoint
 */
const keywordSearch = async (req, res) => {
    try {
        const keyword = req.query.q;
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }
        console.log(`Keyword search: "${keyword}"`);
        const results = await cafeSearchService.keywordSearch(keyword, limit);
        res.status(200).json({
            success: true,
            count: results.length,
            keyword,
            data: results
        });
    }
    catch (error) {
        console.error('Error in keywordSearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm theo từ khóa',
            error: error.message
        });
    }
};
exports.keywordSearch = keywordSearch;
/**
 * Nearby search endpoint
 */
const nearbySearch = async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = req.query.radius ? parseFloat(req.query.radius) : 5;
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tọa độ hợp lệ (lat, lng)'
            });
        }
        console.log(`Nearby search: lat=${lat}, lng=${lng}, radius=${radius}km`);
        const results = await cafeSearchService.nearbySearch(lat, lng, radius);
        res.status(200).json({
            success: true,
            count: results.length,
            location: { lat, lng, radiusKm: radius },
            data: results
        });
    }
    catch (error) {
        console.error('Error in nearbySearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm gần đó',
            error: error.message
        });
    }
};
exports.nearbySearch = nearbySearch;
/**
 * Filter by amenities endpoint
 */
const filterByAmenities = async (req, res) => {
    try {
        const { amenities = [], limit = 20 } = req.body;
        if (!Array.isArray(amenities) || amenities.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn ít nhất một tiện ích'
            });
        }
        console.log('Filter by amenities:', amenities);
        const results = await cafeSearchService.filterByAmenities(amenities, limit);
        res.status(200).json({
            success: true,
            count: results.length,
            amenities,
            data: results
        });
    }
    catch (error) {
        console.error('Error in filterByAmenities:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lọc theo tiện ích',
            error: error.message
        });
    }
};
exports.filterByAmenities = filterByAmenities;
/**
 * Trending cafes endpoint
 */
const getTrendingCafes = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const results = await cafeSearchService.getTrendingCafes(limit);
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }
    catch (error) {
        console.error('Error in getTrendingCafes:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy quán cafe xu hướng',
            error: error.message
        });
    }
};
exports.getTrendingCafes = getTrendingCafes;
/**
 * Open cafes endpoint
 */
const getOpenCafes = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const results = await cafeSearchService.getOpenCafes(limit);
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }
    catch (error) {
        console.error('Error in getOpenCafes:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy quán cafe đang mở',
            error: error.message
        });
    }
};
exports.getOpenCafes = getOpenCafes;
//# sourceMappingURL=cafe.search.controller.js.map