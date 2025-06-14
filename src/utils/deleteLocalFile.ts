import fs from "fs";
import path from "path";

export const deleteLocalFile = (filePath: string) => {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, "../../", filePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      // console.error(`Failed to delete file: ${fullPath}`, err);
    } else {
      // console.log(`Successfully deleted file: ${fullPath}`);
    }
  });
};
