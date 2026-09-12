import * as yup from "yup";

export const createTheorySchema = yup.object({
  title: yup.string().trim().required("Title is required").max(200, "Title is too long"),
  content: yup.string().trim().max(10000, "Content is too long"),
});

export const updateTheorySchema = yup.object({
  title: yup.string().trim().max(200, "Title is too long"),
  content: yup.string().trim().max(10000, "Content is too long"),
});