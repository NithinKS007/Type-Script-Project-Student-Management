import { UserRepository } from "../interface/user.repository";
import { UserCreateDTO } from "../dto/user.dto"
import { User } from "../../domain/entity/user.entity";

export class UserCreateUseCase {

    constructor(private userRepository : UserRepository) {}

    async execute(data:UserCreateDTO):Promise <User> {
        
         return await this.userRepository.signup(data)
    }
}