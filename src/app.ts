import express from "express";
import studentRoute from "./routes/studentRoute"
import adminRoute from "./routes/adminRoute";




const app = express();


app.use(express.json());




app.use("/",studentRoute)
app.use("/admin",adminRoute)

export default app;
