import { Request, Response } from "express";
import { getAdmins } from "../services/adminService";

export const AdminAuthController  = (req:Request,res:Response) =>{
     console.log("getting inside the admin functionsdfssf");
     const adminsData = getAdmins()

     res.send(adminsData)
}