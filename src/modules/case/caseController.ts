import { Request, Response, NextFunction } from "express";
import * as caseService from "./caseService.js";
import sendResponse from "../../shared/utils/response.js";
import AppError from "../../shared/utils/AppError.js";
import { CaseCategory, InvestigationStatus } from "../../../generated/prisma/client.js";

const buildFileUrl = (req: Request, file: Express.Multer.File): string => {
  // Cloud storage engines (e.g. S3) set `location` to an already-absolute URL
  if ((file as any).location) return (file as any).location;
  const relativePath = (file.path ?? "").replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${relativePath}`;
};

export const createCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const created = await caseService.createCase(userId, req.body);
    sendResponse(res, 201, true, "Case created successfully", created);
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
    const updated = await caseService.updateCase(req.params.id as string, requester.id, requester.role, req.body);
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