import { config } from "dotenv";

config({ path: ".env" });

export const port: number = parseInt(process.env.PORT || "8000", 10);
export const mongodbUrl: string = process.env.MONGODB_URI || "";
export const accessSecret: string =
  process.env.JWT_SECRET || "vuGRnaC10rT9f7o9T2REzaZLmMrmgIKz";
export const refreshSecret: string =
  process.env.JWT_SECRET || "R2wcIHr5VUZxb0t0ACiTqzXlApAXrgS5";

export const cloudinaryCloudName: string =
  process.env.CLOUDINARY_CLOUD_NAME || "";
export const cloudinaryApiKey: string = process.env.CLOUDINARY_API_KEY || "";
export const cloudinaryApiSecret: string =
  process.env.CLOUDINARY_API_SECRET || "";

export { config };
