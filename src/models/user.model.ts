import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { accessSecret, refreshSecret } from "../config/config";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  avatar?: string;
  publicId?: string;
  password: string;
  role: "user" | "admin";
  otp?: string;
  otpExpire?: Date;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true },
    avatar: {
      type: String,
    },
    publicId: {
      type: String,
    },
    password: { type: String },
    role: { type: String, default: "user" },
    otp: { type: String },
    otpExpire: { type: Date },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    accessSecret || "vuGRnaC10rT9f7o9T2REzaZLmMrmgIKz",
    { expiresIn: "3d" }
  );
};

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    refreshSecret || "R2wcIHr5VUZxb0t0ACiTqzXlApAXrgS5",
    { expiresIn: "90d" }
  );
};

// verify access token
userSchema.statics.verifyAccessToken = async function (token: string) {
  try {
    const decoded: any = jwt.verify(
      token,
      accessSecret || "vuGRnaC10rT9f7o9T2REzaZLmMrmgIKz"
    );
    return await this.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

// verify refresh token
userSchema.statics.verifyRefreshToken = async function (token: string) {
  try {
    const decoded: any = jwt.verify(
      token,
      refreshSecret || "R2wcIHr5VUZxb0t0ACiTqzXlApAXrgS5"
    );
    const user = await this.findById(decoded.id);
    if (!user || user.refreshToken !== token) return null;
    return user;
  } catch (err) {
    return null;
  }
};

export const User = mongoose.model<IUser>("User", userSchema);
