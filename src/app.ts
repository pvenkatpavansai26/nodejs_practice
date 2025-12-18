import express from "express";
import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import userRouter from "./user/userRouter.ts";
//import createHttpError from "http-errors";
import bookRouter from "./book/bookRouter.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, World!");
});
app.use('/api/users',userRouter);

app.use("/api/books", bookRouter);


app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
if (!res.headersSent) {
  return res.status(statusCode).json({ message });
}
})

export default app;
