import { getFormattedLocalTime } from "../utils/renamefile.js";
import dotenv from "dotenv";

dotenv.config();

export const fileValidationMiddleware = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB

  // Check file size
  if (req.file.size > maxSize) {
    return res.status(400).json({ message: "File size exceeds 10MB" });
  }

  // Extract file extension
  const extname = req.file.originalname.split(".").pop().toLowerCase();

  // Allowed file types
  const allowedExtensions = ["jpeg", "jpg", "png", "svg", "webp"];

  // Check if the file extension is allowed
  if (!allowedExtensions.includes(extname)) {
    return res.status(400).json({
      message: "Only Images are allowed",
    });
  }

  // Rename the file with the formatted local time and keep the extension
  const newFileName = `${getFormattedLocalTime(req)}.${extname}`;
  req.file.originalname = newFileName;

  // If all checks pass, move to the next middleware
  next();
};
