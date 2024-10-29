import mongoose,{Schema,Document} from "mongoose";

export type Admin = {

     fname:string,
     lname:string,
     email:string,
     password:string,
     role:string
}

const AdminSchema:Schema = new Schema({

    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },

}, { timestamps: true })

export type AdminDocument = Admin & Document;

const AdminModel = mongoose.model<AdminDocument>("Admin",AdminSchema)

export default AdminModel