import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password")
  }
};

export const comparePassword = async (userPassword: string, hashedPassword: string): Promise<boolean> =>{
 
  try {
    
    const isMatch = await bcrypt.compare(userPassword,hashedPassword)
    return isMatch

  } catch (error) {
    
    console.log("Error while comparing the passwords:",error);
    throw new Error("Password comparison failed");
    
  }

    
}