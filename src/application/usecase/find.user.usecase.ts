import {User } from "../../domain/entity/user.entity"
import { UserRepository } from "../interface/user.repository"


export class UserDetails {

    constructor(private userRepository : UserRepository) {}

    async execute(id:string) : Promise <User | null> {

        return await this.userRepository.findById(id)
    }
}