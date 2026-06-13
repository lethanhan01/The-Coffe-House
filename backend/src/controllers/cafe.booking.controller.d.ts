import { Request, Response } from 'express';
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCafeBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBookingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBookingStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBookingsByDateAndCafe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cafe.booking.controller.d.ts.map