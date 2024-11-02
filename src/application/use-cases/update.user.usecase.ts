import { UserRepository } from "../interfaces/user.repository";
import { UserUpdateDTO } from "../dtos/user.dtos";
import { User } from "../../domain/entities/user.entity";


export class UserUpdateUseCase {

    constructor(private userRepository:UserRepository) {}

    async execute(data:UserUpdateDTO,id:string):Promise <User | null> {

         return await this.userRepository.update(data,id)
    }


}