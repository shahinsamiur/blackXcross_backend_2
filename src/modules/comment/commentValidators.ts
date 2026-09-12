import * as yup from "yup";

export const createCommentSchema = yup.object({
  content: yup.string().trim().required("Comment content is required").max(2000, "Comment is too long"),
});

export const updateCommentSchema = yup.object({
  content: yup.string().trim().required("Comment content is required").max(2000, "Comment is too long"),
});