import express from "express"
import { StudentController } from "../controllers/student.controller"

const studentRoute = express.Router()

studentRoute.post("/signup",StudentController.signup)
studentRoute.post("/signin",StudentController.signin)
studentRoute.put("/update/:id",StudentController.updateDetails)

export default studentRoute