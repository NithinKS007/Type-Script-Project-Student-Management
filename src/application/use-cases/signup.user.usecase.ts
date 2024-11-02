import { UserRepository } from "../interfaces/user.repository";
import { UserCreateDTO } from "../dtos/user.dtos";
import { User } from "../../domain/entities/user.entity";

export class UserCreateUseCase {

    constructor(private userRepository : UserRepository) {}

    async execute(data:UserCreateDTO):Promise <User> {
        
         return await this.userRepository.signup(data)
    }
}