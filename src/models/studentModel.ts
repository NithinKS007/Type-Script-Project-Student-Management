import mongoose, { Schema,Document } from "mongoose";

export type User = {

    fname:string;
    lname:string;
    email:string;
    phone:number;
    image:string,
    password:string;
    isBlocked: boolean;
}

const UserSchema:Schema = new Schema({

   fname:{type:String,required:true},
   lname:{type:String,required:true},
   email:{type:String,required:true},
   image: {type: String,required:true},
   phone:{type:String,required:true},
   password:{ type: String,required:true},
   isBlocked:{ type: Boolean, default: false },

},{ timestamps: true })

export type UserDocument = User & Document

const UserModel = mongoose.model<UserDocument>("User",UserSchema)

export default UserModel