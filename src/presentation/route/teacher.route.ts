import express from "express"
import { TeacherController } from "../controller/teacher.controller"
import { isAuthenticated,isTeacher } from "../../infrastructure/middleware/auth"

const teacherRoute = express.Router()
teacherRoute.post("/signup",TeacherController.signup)
teacherRoute.post("/signin",TeacherController.signin)
teacherRoute.get("/profile",isAuthenticated,isTeacher,TeacherController.getTeacherProfile);
teacherRoute.put("/update", isAuthenticated,isTeacher,TeacherController.updateTeacherProfile);
teacherRoute.get("/studentsList",isAuthenticated,isTeacher, TeacherController.getAllStudents);
teacherRoute.put("/studentsList/:id",isAuthenticated,isTeacher, TeacherController.updateStudentDetails);
teacherRoute.delete("/studentsList/:id",isAuthenticated,isTeacher, TeacherController.deleteStudent);
teacherRoute.get("/signout",isAuthenticated,isTeacher,TeacherController.signout)

export default teacherRoute