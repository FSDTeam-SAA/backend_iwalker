import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { isValidEmail } from "../utils/emailValidator";

// register user
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

// login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new AppError("Please provide email and password", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// change password
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) throw new AppError("User not authenticated", 401);

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword)
      throw new AppError("All fields are required", 400);

    if (newPassword.length < 6)
      throw new AppError("New password must be at least 6 characters", 400);

    if (newPassword !== confirmNewPassword)
      throw new AppError("New passwords do not match", 400);

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
