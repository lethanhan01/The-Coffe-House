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
const cafeSearchController = __importStar(require("../controllers/cafe.search.controller"));
const router = (0, express_1.Router)();
/**
 * GET /api/search/advanced
 * Advanced search with multiple filters
 * Query params:
 *   - keyword: search by name, address
 *   - isOpen: filter by open status (true/false)
 *   - isCrowded: filter by crowded status (true/false)
 *   - minRating: minimum rating
 *   - hasWifi: has WiFi (true/false)
 *   - hasAc: has AC (true/false)
 *   - hasOutlets: has outlets (true/false)
 *   - isNonSmoking: non-smoking (true/false)
 *   - isQuiet: quiet cafe (true/false)
 *   - hasSnacks: has snacks (true/false)
 *   - sortBy: rating, name, newest
 *   - limit: results per page
 *   - offset: pagination offset
 */
router.get('/advanced', cafeSearchController.advancedSearch);
/**
 * GET /api/search/keyword
 * Simple keyword search
 * Query params:
 *   - q: keyword to search
 *   - limit: results per page
 */
router.get('/keyword', cafeSearchController.keywordSearch);
/**
 * GET /api/search/nearby
 * Search cafes near a location
 * Query params:
 *   - lat: latitude
 *   - lng: longitude
 *   - radius: search radius in km (default: 5)
 */
router.get('/nearby', cafeSearchController.nearbySearch);
/**
 * GET /api/search/trending
 * Get trending cafes
 * Query params:
 *   - limit: number of results
 */
router.get('/trending', cafeSearchController.getTrendingCafes);
/**
 * GET /api/search/open
 * Get currently open cafes
 * Query params:
 *   - limit: number of results
 */
router.get('/open', cafeSearchController.getOpenCafes);
/**
 * POST /api/search/filter
 * Filter cafes by amenities
 * Body:
 *   - amenities: array of amenity names
 *   - limit: number of results
 */
router.post('/filter', cafeSearchController.filterByAmenities);
exports.default = router;
//# sourceMappingURL=cafe.search.routes.js.map