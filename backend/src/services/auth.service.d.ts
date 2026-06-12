export declare const register: (userData: any) => Promise<{
    id: any;
    email: any;
    full_name: any;
    role_id: any;
    avatar_url: any;
}>;
export declare const login: (loginData: any) => Promise<{
    token: string;
    user: any;
}>;
export declare const getCurrentUser: (userId: number) => Promise<{
    id: any;
    email: any;
    full_name: any;
    role_id: any;
    avatar_url: any;
} | null>;
//# sourceMappingURL=auth.service.d.ts.map