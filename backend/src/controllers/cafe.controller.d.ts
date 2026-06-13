import { Request, Response } from 'express';
export declare const getCafes: (req: Request, res: Response) => Promise<void>;
export declare const searchCafes: (req: Request, res: Response) => Promise<void>;
export declare const getCafeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCafe: (req: Request, res: Response) => Promise<void>;
export declare const updateCafe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requestCafeDeletion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCafe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cafe.controller.d.ts.map