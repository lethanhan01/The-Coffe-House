export interface Cafe {
    id: number;
    ownerId: number;
    nameJp: string;
    nameVn: string;
    address: string;
    phoneNumber?: string | null;
    openHours?: string | null;
    isOpen: boolean;
    isCrowded: boolean;
    averageRating: number;
    reviewCount: number;
    coverImageUrl?: string | null;
}
