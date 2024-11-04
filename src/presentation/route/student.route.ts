import express from "express"
import { StudentController } from "../controller/student.controller"
import { isAuthenticated ,isStudent} from "../../infrastructure/middleware/auth"
const studentRoute = express.Router()

studentRoute.post("/signup",StudentController.signup)
studentRoute.post("/signin",StudentController.signin)
studentRoute.get("/profile",isAuthenticated,isStudent,StudentController.getStudentProfile)
studentRoute.put("/update",isAuthenticated,isStudent,StudentController.updateStudentProfile)
studentRoute.get("/signout",isAuthenticated,isStudent,StudentController.signout)

export default studentRoute