import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { accessSecret } from "../config/config";
import { AppError } from "../utils/AppError";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new AppError("Authentication required", 401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      accessSecret || "vuGRnaC10rT9f7o9T2REzaZLmMrmgIKz"
    );

    const user = await User.findById(decoded.id);

    if (!user) throw new AppError("User not found", 404);

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
