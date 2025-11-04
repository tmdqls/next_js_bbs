import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "emailは必須です。" })
  .min(8, { message: "emailは8文字以上で入力してください。" })
  .max(32, { message: "emailは32文字以下で入力してください。" })
  .email({ message: "正しいemail形式で入力してください。" });

export const passwordSchema = z
  .string({ required_error: "passwordは必須です。" })
  .min(8, { message: "passwordは8文字以上で入力してください。" })
  .max(32, { message: "passwordは32文字以下で入力してください。" });

  export const nameSchema = z
  .string({ required_error: "nameは必須です。" })
  .min(2, { message: "nameは2文字以上で入力してください。" })
  .max(10, { message: "nameは10文字以下で入力してください。" });