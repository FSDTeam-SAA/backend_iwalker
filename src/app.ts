import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cors({ origin: "*" }));

// all routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// custom error handler
app.use(errorHandler);

export default app;
