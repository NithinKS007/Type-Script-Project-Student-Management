import { Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwtService";
import { IUserAuthInfoRequest, UserPayLoadDTO } from "../../application/dto/user.dto";

export const isAuthenticated = (req: IUserAuthInfoRequest,res: Response,next: NextFunction) => {

     console.log("Cookies in auth student middleware: ", req.cookies);
     const token = req.cookies.token

  if (!token) {
     res.status(401).json({ error: "Access denied " });
     return

  }
  try {
    const decoded =  verifyToken(token) as UserPayLoadDTO

    req.user= { userId: decoded.userId, role: decoded.role }

    next();

  } catch (error) {

     res.status(401).json({ error: "Invalid token" })
     return
  }
};

export const isStudent = (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
   if (!req.user || req.user.role !== "student") {
       res.status(403).json({ error: "Access denied" });
       return
   }
   next();
};

export const isTeacher = (req:IUserAuthInfoRequest,res:Response,next:NextFunction) =>{

   if (!req.user || req.user.role !== "teacher" ){
       res.status(403).json({ error: "Access denied" });
       return
  }
  next();
}
