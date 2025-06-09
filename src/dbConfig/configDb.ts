import mongoose from "mongoose";
import { mongodbUrl } from "../config/config";

const configDb = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("database connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default configDb;
