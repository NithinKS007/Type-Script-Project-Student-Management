import { Request,Response } from "express";
import { UserCreateUseCase } from "../../application/usecase/signup.user.usecase";
import { UserSignInUseCase } from "../../application/usecase/signin.user.usecase";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";
import { UserUpdateUseCase } from "../../application/usecase/update.user.usecase"
import { UserDetails } from "../../application/usecase/find.user.usecase"
import { FindAllUsers } from "../../application/usecase/find.all.user.usecase"
import { DeleteUser } from "../../application/usecase/delete.user.usecase"
import { hashPassword } from "../../shared/hash.password";
import { generateToken } from "../../infrastructure/auth/jwtService";
import { IUserAuthInfoRequest } from "../../application/dto/user.dto";

const userRepository = new MongoUserRepository()
const createTeacherUseCase = new UserCreateUseCase(userRepository)
const signinTeacherUseCase = new UserSignInUseCase(userRepository)
const getTeacherProfileUseCase = new UserDetails(userRepository)
const updateTeacherProfileUseCase = new UserUpdateUseCase(userRepository)
const getAllUsersUseCase = new FindAllUsers(userRepository)
const updateStudentDetailsUseCase = new UserUpdateUseCase(userRepository)
const deleteStudentUseCase = new DeleteUser(userRepository)


export class TeacherController {

    static async signup(req: Request, res: Response): Promise<void> {

        try {

            const existingTeacher = await userRepository.findByEmail(req.body.email)

            if(existingTeacher) {

                res.status(400).json({ success: false, message: "This email already exists" });

                 return
            }

            const hashedPassword = await hashPassword(req.body.password)

            const teacher = await createTeacherUseCase.execute({...req.body,password:hashedPassword})

            const { password:_,...otherDetails } = teacher

            res.status(201).json({ success: true, message: "Teacher created successfully", teacher: otherDetails });
            
        } catch (error) {
            
            console.log("Error in signup:",error)

            res.status(500).json({ success: false, message: "Failed to create teacher. Please try again" });
        }
    }

    static async signin(req: Request, res: Response) : Promise <void> {

        try {

            const {email,password} = req.body

            const teacher = await signinTeacherUseCase.execute({email,password})

            if(!teacher) {

                res.status(401).json({ success: false, message: "Invalid email or password" });

                 return
            }

            if(!teacher.id||!teacher.role) {

                res.status(400).json({ success: false, message: "Invalid teacher data" });

                return;
            }

            const token = generateToken(teacher.id,teacher.role)
            
            res.cookie("token",token,{

                httpOnly:true,
                secure:false,
                maxAge:3600000 
            })

            const {password:_,...otherDetails} = teacher

            res.status(200).json({ success: true, message: "Login successful", teacher: otherDetails });

        } catch (error) {
            
            console.log("Error in teacher signin");
            
            res.status(500).json({ success: false, message: "Failed to sign in teacher. Please try again" });
        }
    }
    static async getTeacherProfile (req:IUserAuthInfoRequest, res:Response) :Promise<void> {

         try {
            
             const teacherId = req.user?.userId

             if(!teacherId) {

                res.status(403).json({ success: false, message: "Access denied. Unauthorized" });
          
                return
             }

             const teacherDetails = await getTeacherProfileUseCase.execute(teacherId)

             if(!teacherDetails) {

                res.status(404).json({ success: false, message: "Teacher not found" });

                 return
             }

             res.status(200).json({ success: true, teacher: teacherDetails });
             
         } catch (error) {

            console.log("Error fetching teacher details");
            
            res.status(500).json({ success: false, message: "Cannot retrieve teacher details. Please try again" });
         }
    }
    static async updateTeacherProfile(req:IUserAuthInfoRequest ,res:Response) {

        try {

            const teacherId = req.user?.userId

            const teacherData = req.body

            if(!teacherId) {

                res.status(403).json({ success: false, message: "Access denied. Unauthorized" });
                return

            }
            
            const updatedTeacher= await  updateTeacherProfileUseCase.execute(teacherData,teacherId)

            if(!updatedTeacher) {

                res.status(404).json({ success: false, message: "Teacher not found" });
                return;
            }
            const { password, ...otherDetails } = updatedTeacher;

            res.status(200).json({ success: true, teacher: otherDetails });

        } catch (error) {

            console.log("Failed to update teacher details");
            
            res.status(500).json({ success: false, message: "Failed to update teacher details. Please try again" });
        
            
        }
         
    }

    static async getAllStudents(req:IUserAuthInfoRequest, res:Response):Promise<void> {

        try {

            const usersList= await getAllUsersUseCase.execute()

            if (!usersList || usersList.length === 0) {

                res.status(404).json({ success: false, message: "No students found" });

                 return
            }
            
            const studentsList = usersList?.filter((user) => user.role!=="teacher")

            res.status(200).json({ success: true, message: "All students retrieved successfully", studentsList: studentsList });
            
        } catch (error) {

            console.log("Error to get students list");
            
            res.status(500).json({ success: false, message: "Failed to get students list. Please try again" });
            
        }

    }

    static async updateStudentDetails(req:IUserAuthInfoRequest,res:Response):Promise <void> {


          try {

            const studentId = req.params.id
            const updatedStudentData = req.body

            if(!studentId) {

                res.status(400).json({ success: false, message: "Student ID is required" });
                return
      
             }

             const updatedStudent = await updateStudentDetailsUseCase.execute(updatedStudentData,studentId)

             if(!updatedStudent) {

                res.status(404).json({ success: false, message: "Student not found or update failed" });
                return;
             }

             res.status(200).json({ success: true, message: "Student updated successfully", updatedStudent: updatedStudent });

          } catch (error) {

            console.log("Error in updating student",error);
            
            res.status(500).json({ success: false, message: "Failed to update student. Please try again" });
            
          }
    }

    static async deleteStudent(req:IUserAuthInfoRequest,res:Response):Promise <void> {

        try {

            const studentId = req.params.id

            if(!studentId) {

                res.status(400).json({ success: false, message: "Student ID is required" });
                return
            }
            
            const deletedStudentDetails = await deleteStudentUseCase.execute(studentId);

            if (!deletedStudentDetails) {
                res.status(404).json({ success: false, message: "Student not found or already deleted" });
                return;
            }
    
            res.status(200).json({ success: true, message: "Student deleted successfully" ,deletedStudentDetails:deletedStudentDetails});

        } catch (error) {

            console.log("Error deleting student",error);
            
            res.status(500).json({ success: false, message: "Failed to delete student" });
        }

    }

    static async signout(req:IUserAuthInfoRequest,res:Response):Promise<void> {

        try {
        
            res.clearCookie("token");
  
            res.status(200).json({ success: true, message: "Logout successful" });
  
            return
        } catch (error) {
          
            res.status(500).json({ success: false, message: "Failed to logout. Please try again" });
        
        }
    }
    
}

