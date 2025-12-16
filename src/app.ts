import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import userRouter from "./user/userRouter.ts";
import createHttpError from "http-errors";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, World!");
});
app.use('/api/users',userRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({ 
    message: err.message,
    // errorStack: err.stack, 
  
  });
})

export default app;
