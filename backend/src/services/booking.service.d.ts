export declare const createBooking: (data: any) => Promise<any>;
export declare const getUserBookings: (userId: number) => Promise<any[]>;
export declare const getCafeBookings: (cafeId: number) => Promise<any[]>;
export declare const getBookingById: (bookingId: number) => Promise<any>;
export declare const updateBookingStatus: (bookingId: number, status: string) => Promise<any>;
export declare const cancelBooking: (bookingId: number) => Promise<boolean>;
export declare const getBookingsByDateAndCafe: (cafeId: number, bookingDate: string) => Promise<any[]>;
//# sourceMappingURL=booking.service.d.ts.map