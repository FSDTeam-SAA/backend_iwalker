import express, { RequestHandler } from "express";
import {
  changePassword,
  forgotPassword,
  login,
  registerUser,
  resetPassword,
  verifyOtp,
} from "../controllers/authController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/register").post(registerUser as express.RequestHandler);
router.route("/login").post(login as express.RequestHandler);
router
  .route("/change-password")
  .put(isAuthenticated, changePassword as RequestHandler);
router.route("/forgot-password").post(forgotPassword as RequestHandler);
router.route("/verify-otp").post(verifyOtp as RequestHandler);
router.route("/reset-password").post(isAuthenticated, resetPassword as RequestHandler);

export default router;
