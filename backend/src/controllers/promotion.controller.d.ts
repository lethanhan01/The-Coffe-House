import { Request, Response } from 'express';
export declare const createPromotion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCafePromotions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getActivePromotions: (req: Request, res: Response) => Promise<void>;
export declare const getCafeActivePromotions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPromotionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePromotion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePromotion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=promotion.controller.d.ts.map