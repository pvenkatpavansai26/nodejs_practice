import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";


const createUser = async (req: Request, res: Response, next: NextFunction) => {

//console.log('Request body:', req.body);
const {name, email, password} = req.body || {};
//console.log('Destructured values:', {name, email, password});

if(!name || !email || !password){
    const error = createHttpError(400, "All fields are required");
    return next(error);
  } 


res.json({message: "User created"});


};
export { createUser };