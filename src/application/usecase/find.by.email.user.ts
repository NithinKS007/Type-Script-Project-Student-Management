import { User } from "../../domain/entity/user.entity";
import { UserRepository } from "../interface/user.repository";

export class findUserByEmail {

     constructor(private userRepository:UserRepository) {}

     async execute(email:string):Promise <User | null> {

        return await this.userRepository.findByEmail(email)
     }
}