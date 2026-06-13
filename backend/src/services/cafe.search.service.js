"use strict";
/**
 * Advanced Search Service for Cafes
 * Handles complex search queries with filtering, sorting, and pagination
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenCafes = exports.getTrendingCafes = exports.filterByAmenities = exports.nearbySearch = exports.keywordSearch = exports.advancedSearch = void 0;
const db_1 = __importDefault(require("../utils/db"));
/**
 * Advanced search with multiple filters
 */
const advancedSearch = async (filters) => {
    try {
        let query = db_1.default.from('cafes').select('*, amenities(*)');
        // Apply keyword search
        if (filters.keyword && filters.keyword.trim()) {
            const keyword = filters.keyword.trim();
            query = query.or(`name_jp.ilike.%${keyword}%,name_vn.ilike.%${keyword}%,address.ilike.%${keyword}%`);
        }
        // Apply status filters
        if (filters.isOpen === 'true') {
            query = query.eq('is_open', true);
        }
        if (filters.isCrowded === 'true') {
            query = query.eq('is_crowded', true);
        }
        else if (filters.isCrowded === 'false') {
            query = query.eq('is_crowded', false);
        }
        // Apply rating filter
        if (filters.minRating) {
            const minRating = parseFloat(filters.minRating.toString());
            if (!isNaN(minRating)) {
                query = query.gte('average_rating', minRating);
            }
        }
        // Apply amenity filters with inner join if any are selected
        const amenityFilters = [
            filters.hasWifi,
            filters.hasAc,
            filters.hasOutlets,
            filters.isNonSmoking,
            filters.isQuiet,
            filters.hasSnacks
        ];
        if (amenityFilters.some(f => f === 'true')) {
            query = db_1.default.from('cafes').select('*, amenities!inner(*)');
            if (filters.hasWifi === 'true') {
                query = query.eq('amenities.has_wifi', true);
            }
            if (filters.hasAc === 'true') {
                query = query.eq('amenities.has_ac', true);
            }
            if (filters.hasOutlets === 'true') {
                query = query.eq('amenities.has_outlets', true);
            }
            if (filters.isNonSmoking === 'true') {
                query = query.eq('amenities.is_non_smoking', true);
            }
            if (filters.isQuiet === 'true') {
                query = query.eq('amenities.is_quiet', true);
            }
            if (filters.hasSnacks === 'true') {
                query = query.eq('amenities.has_snacks', true);
            }
        }
        // Apply sorting
        let orderBy = 'id';
        let ascending = true;
        if (filters.sortBy === 'rating') {
            orderBy = 'average_rating';
            ascending = false;
        }
        else if (filters.sortBy === 'name') {
            orderBy = 'name_vn';
            ascending = true;
        }
        else if (filters.sortBy === 'newest') {
            orderBy = 'id';
            ascending = false;
        }
        query = query.order(orderBy, { ascending });
        // Apply pagination
        const limit = filters.limit || 20;
        const offset = filters.offset || 0;
        if (limit > 0) {
            query = query.range(offset, offset + limit - 1);
        }
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        // Format response
        return data.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in advancedSearch:', error);
        throw error;
    }
};
exports.advancedSearch = advancedSearch;
/**
 * Search by keyword only (simple search)
 */
const keywordSearch = async (keyword, limit = 20) => {
    try {
        const { data, error } = await db_1.default
            .from('cafes')
            .select('*, amenities(*)')
            .or(`name_jp.ilike.%${keyword}%,name_vn.ilike.%${keyword}%,address.ilike.%${keyword}%`)
            .limit(limit);
        if (error)
            throw new Error(error.message);
        return data.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in keywordSearch:', error);
        throw error;
    }
};
exports.keywordSearch = keywordSearch;
/**
 * Search by location (latitude, longitude, radius in km)
 */
const nearbySearch = async (lat, lng, radiusKm = 5) => {
    try {
        // Note: This requires location data in the database (lat, lng columns)
        // For now, we'll return all cafes and filter by distance in the application
        const { data, error } = await db_1.default
            .from('cafes')
            .select('*, amenities(*)');
        if (error)
            throw new Error(error.message);
        // Filter by distance (basic calculation using Haversine formula)
        const nearby = data.filter((cafe) => {
            if (!cafe.lat || !cafe.lon)
                return false;
            const distance = calculateDistance(lat, lng, cafe.lat, cafe.lon);
            return distance <= radiusKm;
        });
        return nearby.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in nearbySearch:', error);
        throw error;
    }
};
exports.nearbySearch = nearbySearch;
/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Filter by amenities only
 */
const filterByAmenities = async (amenities, limit = 20) => {
    try {
        let query = db_1.default
            .from('cafes')
            .select('*, amenities!inner(*)');
        // Map amenity names to column names
        const amenityMap = {
            'wifi': 'has_wifi',
            'ac': 'has_ac',
            'outlets': 'has_outlets',
            'smoking': 'is_non_smoking',
            'quiet': 'is_quiet',
            'snacks': 'has_snacks'
        };
        // Apply all selected amenity filters
        for (const amenity of amenities) {
            const column = amenityMap[amenity];
            if (column) {
                query = query.eq(`amenities.${column}`, true);
            }
        }
        query = query.limit(limit);
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return data.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in filterByAmenities:', error);
        throw error;
    }
};
exports.filterByAmenities = filterByAmenities;
/**
 * Get trending cafes (sorted by rating and review count)
 */
const getTrendingCafes = async (limit = 10) => {
    try {
        const { data, error } = await db_1.default
            .from('cafes')
            .select('*, amenities(*)')
            .order('average_rating', { ascending: false })
            .order('review_count', { ascending: false })
            .limit(limit);
        if (error)
            throw new Error(error.message);
        return data.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in getTrendingCafes:', error);
        throw error;
    }
};
exports.getTrendingCafes = getTrendingCafes;
/**
 * Get open cafes
 */
const getOpenCafes = async (limit = 20) => {
    try {
        const { data, error } = await db_1.default
            .from('cafes')
            .select('*, amenities(*)')
            .eq('is_open', true)
            .limit(limit);
        if (error)
            throw new Error(error.message);
        return data.map((cafe) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    }
    catch (error) {
        console.error('Error in getOpenCafes:', error);
        throw error;
    }
};
exports.getOpenCafes = getOpenCafes;
//# sourceMappingURL=cafe.search.service.js.map