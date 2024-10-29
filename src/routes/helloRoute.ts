import express from "express";
import { sendHello } from "../controllers/serviceController";


const router = express.Router()

router.get("/",sendHello)

export default router;