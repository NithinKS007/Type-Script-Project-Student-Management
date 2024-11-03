import { UserRepository } from "../interface/user.repository";
import { UserUpdateDTO } from "../dto/user.dto"
import { User } from "../../domain/entity/user.entity";


export class UserUpdateUseCase {

    constructor(private userRepository:UserRepository) {}

    async execute(data:UserUpdateDTO,id:string):Promise <User | null> {

         return await this.userRepository.update(data,id)
    }


}