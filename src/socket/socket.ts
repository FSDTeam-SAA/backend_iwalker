import { Server } from "socket.io";
import { Task } from "../models/task.model";
import cron from "node-cron";
import { differenceInMinutes } from "date-fns";
import jwt from "jsonwebtoken";
import { accessSecret } from "../config/config";
import { IUser } from "../models/user.model";

interface ConnectedUser {
  userId: string;
  socketId: string;
}

const connectedUsers: ConnectedUser[] = [];

export const registerSocketEvents = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("authenticate", (token: string) => {
      try {
        const decoded = jwt.verify(token, accessSecret || "") as IUser;

        const alreadyExists = connectedUsers.find(
          (u) => u.userId === decoded.id
        );
        if (!alreadyExists) {
          connectedUsers.push({ userId: decoded.id, socketId: socket.id });
        }

        console.log("User authenticated:", decoded.email);
      } catch (err) {
        socket.disconnect(true);
      }
    });

    socket.on("disconnect", () => {
      const index = connectedUsers.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) connectedUsers.splice(index, 1);
      console.log("Socket disconnected:", socket.id);
    });
  });

  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const tasks = await Task.find({ notificationEnabled: true }).lean();

      for (const task of tasks) {
        const minutesLeft = differenceInMinutes(task.date, now);

        if (minutesLeft > 0 && minutesLeft % 10 === 0) {
          const user = connectedUsers.find(
            (u) => u.userId === task.user.toString()
          );

          if (user) {
            io.to(user.socketId).emit("taskNotification", {
              message: `Let's move! "${task.name}" in ${minutesLeft} minutes.`,
              taskId: task._id,
              timeLeft: minutesLeft,
            });
          }
        }
      }
    } catch (error) {
      console.error("Notification cron error:", error);
    }
  });
};
