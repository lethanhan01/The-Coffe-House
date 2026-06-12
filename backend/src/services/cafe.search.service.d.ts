/**
 * Advanced Search Service for Cafes
 * Handles complex search queries with filtering, sorting, and pagination
 */
export interface SearchFilter {
    keyword?: string;
    isOpen?: 'true' | 'false';
    isCrowded?: 'true' | 'false';
    minRating?: number;
    hasWifi?: 'true' | 'false';
    hasAc?: 'true' | 'false';
    hasOutlets?: 'true' | 'false';
    isNonSmoking?: 'true' | 'false';
    isQuiet?: 'true' | 'false';
    hasSnacks?: 'true' | 'false';
    sortBy?: 'rating' | 'name' | 'newest';
    limit?: number;
    offset?: number;
}
export interface SearchResult {
    success: boolean;
    count: number;
    data: any[];
    filters?: SearchFilter;
}
/**
 * Advanced search with multiple filters
 */
export declare const advancedSearch: (filters: SearchFilter) => Promise<any[]>;
/**
 * Search by keyword only (simple search)
 */
export declare const keywordSearch: (keyword: string, limit?: number) => Promise<any[]>;
/**
 * Search by location (latitude, longitude, radius in km)
 */
export declare const nearbySearch: (lat: number, lng: number, radiusKm?: number) => Promise<any[]>;
/**
 * Filter by amenities only
 */
export declare const filterByAmenities: (amenities: string[], limit?: number) => Promise<any[]>;
/**
 * Get trending cafes (sorted by rating and review count)
 */
export declare const getTrendingCafes: (limit?: number) => Promise<any[]>;
/**
 * Get open cafes
 */
export declare const getOpenCafes: (limit?: number) => Promise<any[]>;
//# sourceMappingURL=cafe.search.service.d.ts.map