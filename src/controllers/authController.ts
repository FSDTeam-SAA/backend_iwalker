import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { isValidEmail } from "../utils/emailValidator";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { sendEmail } from "../utils/sendEmail";

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

// forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) throw new AppError("Email is required", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

// verify otp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) throw new AppError("Email and OTP are required", 400);

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpire ||
      user.otpExpire < new Date()
    ) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const accessToken = user.generateAccessToken();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "OTP verified successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const user = (req as any).user;

    if (!newPassword || !confirmNewPassword) {
      throw new AppError("Both password fields are required", 400);
    }

    if (newPassword !== confirmNewPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
