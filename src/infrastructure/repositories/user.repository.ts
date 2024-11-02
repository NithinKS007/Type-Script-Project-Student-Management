import { UserRepository } from "../../application/interfaces/user.repository";
import userModel from "../database/user.model";
import { User } from "../../domain/entities/user.entity";
import { UserCreateDTO, UserSignInDTO, UserUpdateDTO } from "../../application/dtos/user.dtos";
import { comparePassword } from "../../shared/hash/hash.password";


export class UserRepositoryImpl implements UserRepository {

     async signup(data: UserCreateDTO): Promise < User > {

        const { fname, lname, email, phone, password, dateOfBirth, address } = data

        const role = data.role || "user"
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

    async update(data:UserUpdateDTO ,id: string ): Promise <User | null> {

        const updatedData = await userModel.findByIdAndUpdate(id,data,{ new: true })

        return updatedData
    }

}