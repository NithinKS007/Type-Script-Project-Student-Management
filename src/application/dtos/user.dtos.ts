import { UserRole } from "../../domain/entities/user.entity";

export interface UserCreateDTO {
    fname: string;
    lname: string;
    email: string;
    phone: number;
    password: string;
    role?: UserRole;
    dateOfBirth?: Date;
    address?: string;
}

export interface UserUpdateDTO extends Partial<UserCreateDTO> {}

export interface  UserSignInDTO{
    email:string,
    password:string
}

