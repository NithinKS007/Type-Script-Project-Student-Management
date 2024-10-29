import mongoose from 'mongoose';

export const connectDB = async() : Promise<void> =>{

     const uri:string = process.env.DATABASE_CONFIG as string

     try {
        await mongoose.connect(uri);
        console.log("Database connected successfully");
     } catch (error) {
        
        if (error instanceof Error) {
            console.log("Error connecting to MongoDB", error.message);
        } else {
            console.log("Unknown error occurred", error);
        }
     }
}

