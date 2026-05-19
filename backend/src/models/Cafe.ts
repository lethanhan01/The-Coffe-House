import { MenuItem } from './MenuItem';
export interface Cafe {
    // id: number;
    // ownerId: number;
    // nameJp: string;
    // nameVn: string;
    // address: string;
    // phoneNumber?: string | null;
    // openHours?: string | null;
    // isOpen: boolean;
    // isCrowded: boolean;
    // averageRating: number;
    // reviewCount: number;
    // coverImageUrl?: string | null;
    id: string;
    owner_id: string | number;
    name: string;
    nameJP: string;
    address: string;
    phone: string;
    openingHours: {
        day: string;
        hours: string;
    }[];
    isOpen: boolean;
    status: 'normal' | 'crowded';
    amenities: {
        hasWifi: boolean;
        hasAC: boolean;
        hasOutlet: boolean;
        noSmoking: boolean;
        hasSnacks: boolean;
        hasCoffee: boolean;
    };
    menu: MenuItem[];
    rating: number;
    reviewCount: number;
    images: string[];
    lat: number;
    lng: number;
}
