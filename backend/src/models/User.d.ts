export interface User {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    passwordHash: string;
    avatarUrl?: string | null;
    roleId: 1 | 2 | 3 | 4;
}
//# sourceMappingURL=User.d.ts.map