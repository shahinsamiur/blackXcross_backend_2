import * as yup from "yup";

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         username:
 *           type: string
 *           example: jane_doe
 *         bio:
 *           type: string
 *           example: Cold-case researcher and true-crime enthusiast.
 *         avatar:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/avatars/jane.png
 */
export const updateUserSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters"),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]{3,20}$/, "Username must be 3-20 letters, numbers, or underscores"),
  bio: yup.string().max(280, "Bio must be at most 280 characters"),
  avatar: yup.string().url("Avatar must be a valid URL"),
});