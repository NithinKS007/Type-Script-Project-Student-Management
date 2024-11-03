import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
const expiresIn =  process.env.JWT_EXPIRATION!

export const generateToken = (userId: string, role: string): string => {
    const token = jwt.sign(
        { userId, role}, 
        secret, 
        { expiresIn } 
    );
    return token; 
};

export const verifyToken = (token:string) =>{

   const decoded = jwt.verify(token,secret) 

   return decoded

}