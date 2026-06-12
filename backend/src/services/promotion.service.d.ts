export declare const createPromotion: (data: any) => Promise<{
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null>;
export declare const getCafePromotions: (cafeId: number) => Promise<({
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null)[]>;
export declare const getActivePromotions: () => Promise<({
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null)[]>;
export declare const getPromotionById: (promotionId: number) => Promise<{
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null>;
export declare const getCafeActivePromotions: (cafeId: number) => Promise<({
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null)[]>;
export declare const updatePromotion: (promotionId: number, data: any) => Promise<{
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null>;
export declare const deletePromotion: (promotionId: number) => Promise<{
    id: any;
    cafeId: any;
    title: any;
    titleJp: any;
    description: any;
    descriptionJp: any;
    imageUrl: any;
    validUntil: any;
    createdAt: any;
} | null>;
//# sourceMappingURL=promotion.service.d.ts.map