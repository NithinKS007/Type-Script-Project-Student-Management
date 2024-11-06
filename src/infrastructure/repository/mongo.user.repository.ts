import { UserRepository } from "../../application/interface/user.repository";
import userModel from "../database/user.model";
import { User } from "../../domain/entity/user.entity";
import { UserCreateDTO, UserSignInDTO, UserUpdateDTO } from "../../application/dto/user.dto";
import { comparePassword } from "../../shared/hash.password";


export class MongoUserRepository implements UserRepository {

     async signup(data: UserCreateDTO): Promise < User > {

        const { fname, lname, email, phone, password, dateOfBirth, address ,role } = data

        const user = new userModel({
            fname,
            lname,
            email,
            phone,
            password,
            role,
            dateOfBirth,
            address,
        });

        return await user.save();
    }


    async signin(data: UserSignInDTO): Promise<User | null> {
       
      const user = await userModel.findOne({email:data.email})

      if (!user) {
        console.log("User not found for email:", data.email);
        return null;
    }

      const isValidPassword = await comparePassword(data.password,user.password)

      if (!isValidPassword) {
        console.log("Invalid password for user:", data.email);
        return null;
    }
      
      return user
    
    }

    async findByEmail(email: string): Promise<User | null> {
        
        return await userModel.findOne({email:email})
    }
    
    async findById(id:string) : Promise<User | null> {

        return await userModel.findById(id)
    }

    async update(data:UserUpdateDTO ,id: string ): Promise <User | null> {

        const updatedData = await userModel.findByIdAndUpdate(id,data,{ new: true })

        return updatedData
    }
    async findAll(): Promise<User[] | null> {
      
      const allUsers = await userModel.find()

      return allUsers
    }
    
    async delete(id:string):Promise<User | null> {

        const deletedUser = await userModel.findByIdAndDelete(id)

        return deletedUser
    }

}