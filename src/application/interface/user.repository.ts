import { User } from "../../domain/entity/user.entity";
import { UserCreateDTO, UserSignInDTO,UserUpdateDTO } from "../dto/user.dto";

export interface UserRepository {
  signup(data: UserCreateDTO): Promise<User>;
  signin(data: UserSignInDTO): Promise<User| null>;
  findByEmail(email:string) : Promise<User | null>
  update(data: UserUpdateDTO,id: string ): Promise<User | null>;
  findById(id:string):Promise <User | null>
  findAll():Promise <User[] | null>
  delete(id:string):Promise <User | null>
}
