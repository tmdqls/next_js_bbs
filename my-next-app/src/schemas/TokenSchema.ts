import { z } from "zod";

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "リフレッシュトークンは必須です。"),
});