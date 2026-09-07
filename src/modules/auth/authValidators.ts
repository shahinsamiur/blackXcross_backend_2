import * as yup from "yup";

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: secret123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: secret123
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Raw verification token received via email
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Raw reset token received via email
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: newSecret123
 */

export const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const verifyEmailSchema = yup.object({
  token: yup.string().required("Token is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required("Token is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
});