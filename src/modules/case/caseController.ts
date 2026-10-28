import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import * as caseService from "./caseService.js";
import sendResponse from "../../shared/utils/response.js";
import AppError from "../../shared/utils/AppError.js";
import { CaseCategory, InvestigationStatus } from "../../../generated/prisma/client.js";
const buildFileUrl = (req: Request, file: Express.Multer.File): string => {
  if ((file as any).location) return (file as any).location;
  const relativePath = (file.path ?? "").replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${relativePath}`;
};
const PENDING_THUMBNAIL_MARKER = "/uploads/cases/_pending/";
const finalizeThumbnail = (caseId: string, imageUrl?: string | null): string | undefined => {
  if (!imageUrl || !imageUrl.includes(PENDING_THUMBNAIL_MARKER)) {
    return imageUrl ?? undefined;
  }

  const filename = imageUrl.split(PENDING_THUMBNAIL_MARKER)[1];
  const oldPath = path.join("uploads/cases/_pending", filename);
  const newDir = path.join("uploads/cases", caseId, "thumbnail");
  const newPath = path.join(newDir, filename);

  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }

  return imageUrl.replace(PENDING_THUMBNAIL_MARKER, `/uploads/cases/${caseId}/thumbnail/`);
};
export const createCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const created = await caseService.createCase(requester.id, req.body);

    const finalImageUrl = finalizeThumbnail(created.id, created.imageUrl);
    const finalCase =
      finalImageUrl && finalImageUrl !== created.imageUrl
        ? await caseService.updateCase(created.id, requester.id, requester.role, { imageUrl: finalImageUrl })
        : created;

    sendResponse(res, 201, true, "Case created successfully", finalCase);
  } catch (error) {
    next(error);
  }
};
export const listCases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "20"), 10) || 20, 1), 50);

    const category = req.query.category as CaseCategory | undefined;
    if (category && !Object.values(CaseCategory).includes(category)) {
      throw new AppError("Invalid category", 400);
    }

    const status = req.query.status as InvestigationStatus | undefined;
    if (status && !Object.values(InvestigationStatus).includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const result = await caseService.listCases({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      category,
      status,
      tag: typeof req.query.tag === "string" ? req.query.tag : undefined,
      sort: req.query.sort === "oldest" ? "oldest" : "newest",
      page,
      limit,
    });

    sendResponse(res, 200, true, "Cases fetched successfully", result);
  } catch (error) {
    next(error);
  }
};
export const getCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const found = await caseService.getCaseById(req.params.id as string, requester?.id, requester?.role);
    sendResponse(res, 200, true, "Case fetched successfully", found);
  } catch (error) {
    next(error);
  }
};
export const updateCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const caseId = req.params.id as string;
    const body = { ...req.body };
    if (body.imageUrl) {
      body.imageUrl = finalizeThumbnail(caseId, body.imageUrl);
    }
    const updated = await caseService.updateCase(caseId, requester.id, requester.role, body);
    sendResponse(res, 200, true, "Case updated successfully", updated);
  } catch (error) {
    next(error);
  }
};
export const deleteCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    await caseService.deleteCase(req.params.id as string, requester.id, requester.role);
    sendResponse(res, 200, true, "Case deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
export const publishCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await caseService.publishCase(req.params.id as string,  requester.id, requester.role);
    sendResponse(res, 200, true, "Case published successfully", updated);
  } catch (error) {
    next(error);
  }
};
export const draftCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const updated = await caseService.draftCase(req.params.id as string, requester.id, requester.role);
    sendResponse(res, 200, true, "Case moved to draft successfully", updated);
  } catch (error) {
    next(error);
  }
};
export const getCaseTheories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const theories = await caseService.getCaseTheories(req.params.id as string, requester?.id, requester?.role);
    sendResponse(res, 200, true, "Theories fetched successfully", theories);
  } catch (error) {
    next(error);
  }
};
export const getCaseFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const files = await caseService.getCaseFiles(req.params.id as string, requester?.id, requester?.role);
    sendResponse(res, 200, true, "Files fetched successfully", files);
  } catch (error) {
    next(error);
  }
};
export const addCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const file = (req as any).file;

    if (!file) {
      throw new AppError("No file uploaded", 400);
    }

    const created = await caseService.addCaseFile(req.params.id as string, requester.id, requester.role, {
      url: buildFileUrl(req, file),
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    sendResponse(res, 201, true, "File uploaded successfully", created);
  } catch (error) {
    next(error);
  }
};
export const addCaseGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    const file = (req as any).file;

    if (!file) {
      throw new AppError("No image uploaded", 400);
    }

    const created = await caseService.addCaseFile(req.params.id as string, requester.id, requester.role, {
      url: buildFileUrl(req, file),
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    sendResponse(res, 201, true, "Gallery image uploaded successfully", created);
  } catch (error) {
    next(error);
  }
};
export const removeCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requester = (req as any).user;
    await caseService.removeCaseFile(req.params.id as string, req.params.fileId as string, requester.id, requester.role);
    sendResponse(res, 200, true, "File deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
export const uploadCaseImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = (req as any).file;
    if (!file) {
      throw new AppError("No image uploaded", 400);
    }
    const imageUrl = buildFileUrl(req, file);
    sendResponse(res, 200, true, "Image uploaded successfully", { imageUrl });
  } catch (error) {
    next(error);
  }
};