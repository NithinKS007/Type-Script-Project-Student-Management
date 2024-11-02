import { User } from "../../domain/entities/user.entity";
import { UserCreateDTO, UserSignInDTO,UserUpdateDTO } from "../dtos/user.dtos";

export interface UserRepository {
  signup(data: UserCreateDTO): Promise<User>;
  signin(data: UserSignInDTO): Promise<User| null>;
  findByEmail(email:string) : Promise<User | null>
  update(data: UserUpdateDTO,id: string ): Promise<User | null>;
}
