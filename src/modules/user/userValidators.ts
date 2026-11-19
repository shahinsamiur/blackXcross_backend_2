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
 *         title:
 *           type: string
 *           example: Lead Researcher
 *         location:
 *           type: string
 *           example: Dhaka, Bangladesh
 *         website:
 *           type: string
 *           format: uri
 *           example: https://example.com
 */
export const updateUserSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]{3,20}$/, "Username must be 3-20 letters, numbers, or underscores"),
  bio: yup.string().max(280, "Bio must be at most 280 characters"),
  avatar: yup.string().url("Avatar must be a valid URL"),
  title: yup.string().max(50, "Title must be at most 50 characters"),
  location: yup.string().max(80, "Location must be at most 80 characters"),
  website: yup
    .string()
    .url("Website must be a valid URL")
    .max(200, "Website must be at most 200 characters"),
});