import { Request, Response } from "express";
import { UserCreateUseCase } from "../../application/use-cases/signup.user.usecase";
import { UserSignInUseCase } from "../../application/use-cases/signin.user.usecase";
import {UserUpdateUseCase} from "../../application/use-cases/update.user.usecase"
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { hashPassword } from "../../shared/hash/hash.password";

const userRepository = new UserRepositoryImpl();
const createStudentUseCase = new UserCreateUseCase(userRepository);
const signInStudentUseCase = new UserSignInUseCase(userRepository);
const updateStudentUseCase = new UserUpdateUseCase(userRepository)

export class StudentController {

  static async signup(req: Request, res: Response): Promise<void> {
    try {

      const existingStudent = await userRepository.findByEmail(req.body.email)

      if (existingStudent) {
         res.status(400).json({ success: false, message: "This email already exists" });
         return;
      }
      const hashedPassword = await hashPassword(req.body.password);

      const student = await createStudentUseCase.execute({...req.body,password: hashedPassword,});

      const { password, ...otherDetails } = student;

      res.status(201).json({student:otherDetails,success:true,message:"successfully created"})

    } catch (error) {

      console.error("Error in signup:", error);

      res.status(400).json({ error: "Failed to create user" });
      
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {

      const { email, password } = req.body;


      const student = await signInStudentUseCase.execute({email,password})
      console.log(student) 

      if (student === null) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return; 
      }
      res.status(200).json({success:true,message:"Login successfull"})

    } catch (error) {

      res.status(400).json({ error: "Failed to signin for student"});
      
    }
  }

  static async updateDetails(req:Request, res:Response): Promise<void> {

     try {

        const userId = req.params.id; 
        const userData = req.body
        const updatedStudent = await  updateStudentUseCase.execute(userData,userId)

        if (!updatedStudent) {
          res.status(404).json({ success: false, message: "User not found" });
          return;
      }

      const { password, ...otherDetails } = updatedStudent;

      res.status(200).json({ success: true, user: otherDetails });

     } catch (error) {
      
       res.status(400).json({error:"Failed to update user details"})
     }
  }
  
}
