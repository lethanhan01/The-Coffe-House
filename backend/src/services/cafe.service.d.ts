import { Cafe } from '../models/Cafe';
export declare const getAllCafes: () => Promise<Cafe[]>;
export declare const mapCafeFromDB: (data: any) => Cafe;
export declare const getCafeById: (cafeId: number) => Promise<Cafe | null>;
interface CreateCafeInput {
    owner_id: number;
    name_jp: string;
    name_vn: string;
    address: string;
    phone_number: string;
    open_hours?: string;
    cover_image_url?: string;
    place_id?: string | number;
    lat?: number;
    lng?: number;
    amenities?: {
        has_wifi?: boolean;
        has_ac?: boolean;
        has_outlets?: boolean;
        is_non_smoking?: boolean;
        has_snacks?: boolean;
        has_high_tables?: boolean;
        is_quiet?: boolean;
    };
}
export declare const createCafe: (data: CreateCafeInput) => Promise<number>;
export interface UpdateCafeInput {
    name_jp?: string;
    name_vn?: string;
    address?: string;
    phone_number?: string;
    cover_image_url?: string;
    is_open?: boolean;
    is_crowded?: boolean;
    amenities?: {
        has_ac?: boolean;
        has_wifi?: boolean;
        has_snacks?: boolean;
        has_outlets?: boolean;
        is_non_smoking?: boolean;
        has_high_tables?: boolean;
    };
}
export declare const updateCafe: (cafeId: number, updateData: UpdateCafeInput) => Promise<boolean>;
export declare const requestCafeDeletion: (cafeId: number, ownerId: number, reason: string) => Promise<boolean>;
export declare const deleteCafe: (cafeId: number) => Promise<boolean>;
export declare const searchCafes: (filters: any) => Promise<any[]>;
export {};
//# sourceMappingURL=cafe.service.d.ts.map