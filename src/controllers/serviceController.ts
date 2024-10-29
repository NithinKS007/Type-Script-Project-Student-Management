import { Request, Response } from "express";
import { getHelloMessage } from "../services/service";

export const sendHello = (req:Request,res:Response) =>{

     const message = getHelloMessage()

     res.send(message)
}