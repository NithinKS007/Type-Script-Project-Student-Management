import { User } from "../../domain/entity/user.entity";
import { UserSignInDTO } from "../dto/user.dto"
import { UserRepository } from "../interface/user.repository";


export class UserSignInUseCase {
    
    constructor(private userRepository: UserRepository) {}

    async execute(data: UserSignInDTO): Promise<User | null> {

        return await this.userRepository.signin(data)

    }
}
