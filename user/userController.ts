import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import { sub } from "date-fns";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import type { User } from "./userTypes.ts";



const createUser = async (req: Request, res: Response, next: NextFunction) => {

const {name, email, password} = req.body || {};
//validation
if(!name || !email || !password){
    const error = createHttpError(400, "All fields are required");
    return next(error);
  } 
//database call
try{
    const user = await userModel.findOne({email});

    if(user){
    const error = createHttpError(409, "User already exists");
    return next(error);
  }
}
catch (error){
    return next (createHttpError(500, "error"));
}


//password
const hashedPassword = await bcrypt.hash(password, 10);
let newUser: User;
try{
    newUser = await userModel.create({
    name,
    email,
    password: hashedPassword
});
}
catch (error){
    return next (createHttpError(500, "error"));
}
try{ 
//token generator
const token = sign({sub: newUser._id}, process.env.jwt_secret as string, {expiresIn: '1d'});
//response
res.json ({accessToken: token});
}
catch (error){
    return next (createHttpError(500, "error"));
}
};
export { createUser };