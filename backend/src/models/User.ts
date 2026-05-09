export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string | null;
    roleId: 1 | 2 | 3 | 4;
}
