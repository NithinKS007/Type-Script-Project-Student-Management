import { Request, Response } from "express";
import { getStudents } from "../services/studentService";

export const StudentAuthController  = (req:Request,res:Response) =>{

     const studentsData = getStudents()

     res.send(studentsData)
}