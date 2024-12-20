export type UserRole = "student" | "teacher";

export interface User {
    id?: string;
    fname: string;
    lname: string;
    email: string;
    phone: number;
    password: string;
    isBlocked: boolean;
    role: UserRole;
    dateOfBirth?: Date;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

