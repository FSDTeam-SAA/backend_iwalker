import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import taskRouter from "./routes/taskRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cors({ origin: "*" }));

// all routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

// custom error handler
app.use(errorHandler);

export default app;
