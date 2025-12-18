import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import type { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface AccessTokenPayload extends JwtPayload {
  sub: string;
}

export interface Auth extends Request {
  userId?: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {

    console.log("==== AutenticateBook HIT ====");
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // "Bearer <token>"
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(createHttpError(500, "JWT secret not configured"));
  }

  try {
    const decoded = jwt.verify(token, secret) as AccessTokenPayload;
    console.log("decoded", decoded);

    const _req = req as Auth;
    _req.userId = decoded.sub as string;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
