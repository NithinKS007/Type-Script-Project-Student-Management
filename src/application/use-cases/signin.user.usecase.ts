import { User } from "../../domain/entities/user.entity";
import { UserSignInDTO } from "../dtos/user.dtos";
import { UserRepository } from "../interfaces/user.repository";


export class UserSignInUseCase {
    
    constructor(private userRepository: UserRepository) {}

    async execute(data: UserSignInDTO): Promise<User | null> {

        return await this.userRepository.signin(data)

    }
}
