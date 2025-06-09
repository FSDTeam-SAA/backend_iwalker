import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { isValidEmail } from "../utils/emailValidator";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      throw new AppError("All fields are required", 400);

    if (!isValidEmail(email)) throw new AppError("Invalid email format", 400);

    if (password.length < 6)
      throw new AppError("Password must be at least 6 characters", 400);

    if (password !== confirmPassword)
      throw new AppError("Passwords do not match", 400);

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new AppError("Email already registered", 400);

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};
