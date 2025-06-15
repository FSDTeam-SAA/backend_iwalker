import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ITask extends Document {
  user: IUser["_id"];
  name: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  isFullDay: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Task name is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
    },
    isFullDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
