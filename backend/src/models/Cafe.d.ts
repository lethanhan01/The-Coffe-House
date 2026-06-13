import { MenuItem } from './MenuItem';
export interface Cafe {
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
//# sourceMappingURL=Cafe.d.ts.map