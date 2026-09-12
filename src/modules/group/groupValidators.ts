import * as yup from "yup";
import { GroupRole } from "../../../generated/prisma/client.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateGroupRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isPrivate:
 *           type: boolean
 *     UpdateGroupRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isPrivate:
 *           type: boolean
 *     InviteMemberRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *     UpdateMemberRoleRequest:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [ADMIN, MEMBER]
 *     CreateChannelRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     UpdateChannelRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */
export const createGroupSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().max(2000, "Description is too long"),
  isPrivate: yup.boolean().default(false),
});

export const updateGroupSchema = yup.object({
  name: yup.string(),
  description: yup.string().max(2000, "Description is too long"),
  isPrivate: yup.boolean(),
});

export const inviteMemberSchema = yup.object({
  userId: yup.string().required("userId is required"),
});

export const updateMemberRoleSchema = yup.object({
  role: yup
    .mixed<GroupRole>()
    .oneOf([GroupRole.ADMIN, GroupRole.MEMBER], "Role must be ADMIN or MEMBER")
    .required("Role is required"),
});

export const createChannelSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().max(500, "Description is too long"),
});

export const updateChannelSchema = yup.object({
  name: yup.string(),
  description: yup.string().max(500, "Description is too long"),
});