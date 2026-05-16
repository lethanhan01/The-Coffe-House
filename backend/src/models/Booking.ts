export interface Booking {
    id: number;
    userId: number;
    cafeId: number;
    bookingDate: string;
    bookingTime: string;
    numberOfPeople: number;
    status: 'pending' | 'confirmed' | 'rejected';
    createdAt: string;
}
