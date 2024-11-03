import { Request, Response } from "express";
import { UserCreateUseCase } from "../../application/usecase/signup.user.usecase";
import { UserSignInUseCase } from "../../application/usecase/signin.user.usecase";
import {UserUpdateUseCase} from "../../application/usecase/update.user.usecase"
import {UserDetails} from "../../application/usecase/find.user.usecase"
import { UserRepositoryImpl } from "../../infrastructure/repository/user.repository";
import { hashPassword } from "../../shared/hash.password";
import { generateToken } from "../../infrastructure/auth/jwtService";
import { IUserAuthInfoRequest } from "../../application/dto/user.dto";


const userRepository = new UserRepositoryImpl();
const createStudentUseCase = new UserCreateUseCase(userRepository);
const signInStudentUseCase = new UserSignInUseCase(userRepository);
const updateStudentUseCase = new UserUpdateUseCase(userRepository)
const getStudentProfile = new UserDetails(userRepository)

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

      if (student === null) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return; 
      }

      if (!student.id || !student.role) {

        res.status(400).json({ success: false, message: "Invalid student data" });
        return;
      }
      const token =  generateToken(student.id,student.role)

      res.cookie("token",token,{
         httpOnly:true,
         secure:false,
         maxAge:3600000 
      })

      const { password: _, ...otherDetails } = student;
      
      res.status(200).json({success:true, message:"Login successfull", student:otherDetails})

    } catch (error) {

      res.status(400).json({ error: "Failed to signin for student"});
      
    }
  }

  static async getProfile (req:IUserAuthInfoRequest,res:Response):Promise<void> {

      try {

        const userId =  req.user?.userId

        console.log(`userId received for loading user profile`,userId)

        if(!userId) {

          res.status(401).json({ success: false, message: "Unauthorized" });
          
          return
        }

        const studentDetails = await getStudentProfile.execute(userId)

        if(!studentDetails) {

           res.status(404).json({success:false,message:"User not found"})

           return
        }

        res.status(200).json({success:true,user:studentDetails})
        
      } catch (error) {

           res.status(400).json({error:"Cannot get user details"})
      }
  }
  static async updateDetails(req:IUserAuthInfoRequest, res:Response): Promise<void> {

     try {

        const userId = req.user?.userId
        const userData = req.body

        console.log(`Updating user: ${req.user?.userId}`);

        if(!userId) {

          res.status(401).json({ success: false, message: "Unauthorized" });
          return

        }
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

  static async signout(req:Request,res:Response) :Promise<void> {

      try {
        
          res.clearCookie("token");

          res.status(200).json({ success: true, message: "Logout successful" });

          return
      } catch (error) {
        
          res.status(400).json({ error: "Failed to logout" });
      }
  }
  
  
}
