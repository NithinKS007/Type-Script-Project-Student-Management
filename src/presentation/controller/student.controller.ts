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
const updateStudentProfileUseCase = new UserUpdateUseCase(userRepository)
const getStudentProfileUseCase = new UserDetails(userRepository)

export class StudentController {

  static async signup(req: Request, res: Response): Promise<void> {
    try {

      const existingStudent = await userRepository.findByEmail(req.body.email)

      if (existingStudent) {
        res.status(400).json({ success: false, message: "Email already exists" });
         return;
      }
      const hashedPassword = await hashPassword(req.body.password);

      const student = await createStudentUseCase.execute({...req.body,password: hashedPassword});

      const { password, ...otherDetails } = student;

      res.status(201).json({ success: true, message: "Student created successfully.", student: otherDetails });

    } catch (error) {

      console.log("Error in student signup:", error);

      res.status(500).json({ success: false, message: "Failed to create student. Please try again" });
      
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {

      const { email, password } = req.body;

      const student = await signInStudentUseCase.execute({email,password})

      if (!student) {
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
      
      res.status(200).json({ success: true, message: "Login successful", student: otherDetails });

    } catch (error) {

      console.log("Error in signin student ",error);
      res.status(500).json({ success: false, message: "Failed to sign in. Please try again" });
      
    }
  }

  static async getStudentProfile (req:IUserAuthInfoRequest,res:Response):Promise<void> {

      try {

        const userId =  req.user?.userId

        if(!userId) {

          res.status(403).json({ success: false, message: "Access denied. Unauthorized" });
          
          return
        }

        const studentDetails = await getStudentProfileUseCase.execute(userId)

        if(!studentDetails) {

          res.status(404).json({ success: false, message: "Student not found" });

           return
        }

        res.status(200).json({ success: true, student: studentDetails });
        
      } catch (error) {

        console.log("Error fetching student details",error);
        
        res.status(500).json({ success: false, message: "Cannot retrieve student details. Please try again" });
      }
  }
  static async updateStudentProfile(req:IUserAuthInfoRequest, res:Response): Promise<void> {

     try {

        const userId = req.user?.userId
        const userData = req.body

        if(!userId) {

          res.status(403).json({ success: false, message: "Access denied. Unauthorized" });
          return

        }
        const updatedStudent = await  updateStudentProfileUseCase.execute(userData,userId)

        if (!updatedStudent) {
          res.status(404).json({ success: false, message: "Student not found" });
          return;
      }

      const { password, ...otherDetails } = updatedStudent;

      res.status(200).json({ success: true, student: otherDetails });

     } catch (error) {
      
       console.log("Error updating student details");
      
       res.status(500).json({ success: false, message: "Failed to update student details. Please try again" });
     }
  }

  static async signout(req:Request,res:Response) :Promise<void> {

      try {
        
          res.clearCookie("token");

          res.status(200).json({ success: true, message: "Logout successful" });

          return
      } catch (error) {
        
          console.log("Error in signin out student");
          
          res.status(500).json({ success: false, message: "Failed to logout. Please try again" });
      }
  }
  
  
}
