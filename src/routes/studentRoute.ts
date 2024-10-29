import express from "express";
import { StudentAuthController } from "../controllers/StudentAuthController";


const  studentRoute = express.Router()

studentRoute.get("/",StudentAuthController)


export default studentRoute;