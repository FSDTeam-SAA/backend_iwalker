import express from "express";
import { login, registerUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser as express.RequestHandler);
router.route("/login").post(login as express.RequestHandler);

export default router;
