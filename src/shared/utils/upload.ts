import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";
import crypto from "crypto";

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
  ".webm",
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
];

const CASES_ROOT = "uploads/cases";

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

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

const uniqueFilename = (file: Express.Multer.File): string => {
  const ext = path.extname(file.originalname);
  return `${crypto.randomUUID()}${ext}`;
};


const thumbnailStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = `${CASES_ROOT}/_pending`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uniqueFilename(file));
  },
});
export const caseImageUpload = multer({ storage: thumbnailStorage, fileFilter });

const galleryStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = `${CASES_ROOT}/${req.params.id}/gallery`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uniqueFilename(file));
  },
});
export const caseGalleryUpload = multer({ storage: galleryStorage, fileFilter });

const evidenceStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = `${CASES_ROOT}/${req.params.id}/files`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uniqueFilename(file));
  },
});
export const caseFileUpload = multer({ storage: evidenceStorage, fileFilter });

export default caseFileUpload;