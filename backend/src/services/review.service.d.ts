export declare const getReviewsByCafeId: (cafe_id: number) => Promise<{
    id: any;
    cafe_id: any;
    user_id: any;
    userName: any;
    avatarUrl: any;
    rating: number;
    comment: any;
    createdAt: any;
    images: any;
}[]>;
export declare const createReview: (reviewData: {
    cafe_id: number;
    user_id: number;
    rating: number;
    comment?: string;
    image_urls?: string[];
}) => Promise<{
    id: any;
    cafe_id: number;
    user_id: number;
    rating: number;
    comment: string | undefined;
    image_urls: string[];
    new_cafe_average_rating: number;
    new_cafe_review_count: number;
}>;
export declare const createReviewReport: (reportData: {
    review_id: number;
    reporter_id: number;
    reason: string;
    detail: string;
}) => Promise<{
    id: any;
}>;
//# sourceMappingURL=review.service.d.ts.map