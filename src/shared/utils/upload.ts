import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".doc",
  ".docx",
  ".zip",
  ".mp4",
  ".mov",
  ".avi",
];

// Configure storage
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, "uploads/cases/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed for case evidence"));
  }
};

// Initialize multer
const caseUpload = multer({ storage, fileFilter });

export default caseUpload;