import { Request, Response } from 'express';
/**
 * Advanced search endpoint
 */
export declare const advancedSearch: (req: Request, res: Response) => Promise<void>;
/**
 * Keyword search endpoint
 */
export declare const keywordSearch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Nearby search endpoint
 */
export declare const nearbySearch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Filter by amenities endpoint
 */
export declare const filterByAmenities: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Trending cafes endpoint
 */
export declare const getTrendingCafes: (req: Request, res: Response) => Promise<void>;
/**
 * Open cafes endpoint
 */
export declare const getOpenCafes: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cafe.search.controller.d.ts.map