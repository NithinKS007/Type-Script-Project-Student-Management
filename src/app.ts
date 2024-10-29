import express, { Request, Response } from "express";
import helloRoutes from "./routes/helloRoute"


const app = express();


app.use(express.json());



app.use("/",helloRoutes)



export default app;
