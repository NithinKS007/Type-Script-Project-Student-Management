import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UserRole } from "../../domain/entity/user.entity";

export interface UserCreateDTO {
    fname: string;
    lname: string;
    email: string;
    phone: number;
    password: string;
    role: UserRole;
    dateOfBirth?: Date;
    address?: string;
}

export interface UserUpdateDTO extends Partial<UserCreateDTO> {}

export interface  UserSignInDTO{
    email:string,
    password:string
}

export interface  UserPayLoadDTO extends JwtPayload{
    userId:string,
    role: UserRole
}

export interface IUserAuthInfoRequest extends Request {
    user?: UserPayLoadDTO; 
}
