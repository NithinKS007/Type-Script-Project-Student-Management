import express from "express"
import { StudentController } from "../controller/student.controller"
import { isAuthenticated ,isStudent} from "../../infrastructure/middleware/studentAuth"
const studentRoute = express.Router()

studentRoute.post("/signup",StudentController.signup)
studentRoute.post("/signin",StudentController.signin)
studentRoute.get("/profile",isAuthenticated,isStudent,StudentController.getProfile)
studentRoute.put("/update",isAuthenticated,isStudent,StudentController.updateDetails)
studentRoute.get("/signout",isAuthenticated,isStudent,StudentController.signout)

export default studentRoute