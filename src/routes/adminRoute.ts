import express from "express";
import { AdminAuthController } from "../controllers/AdminAuthController";


const  adminRoute = express.Router()

adminRoute.get("/login",AdminAuthController)


export default adminRoute;