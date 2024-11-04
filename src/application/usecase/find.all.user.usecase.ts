import {User } from "../../domain/entity/user.entity"
import { UserRepository } from "../interface/user.repository"


export class FindAllUsers {

    constructor(private userRepository : UserRepository) {}

    async execute() : Promise <User[] | null> {

        return await this.userRepository.findAll()
    }
}