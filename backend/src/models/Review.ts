export interface Review {
    id: number;
    cafeId: number;
    userId: number;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string | null;
    createdAt: string;
}
