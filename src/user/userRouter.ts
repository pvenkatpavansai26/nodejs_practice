import express from "express";
import { createUser, loginuser } from "./userController.ts";
const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginuser);

export default userRouter;
