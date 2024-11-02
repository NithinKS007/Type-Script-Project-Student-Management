import express from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/mongoose";
import student from "./presentation/routes/student.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/students",student)

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("Failed to connect to DB", error));
