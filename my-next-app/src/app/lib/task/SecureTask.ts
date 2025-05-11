import crypto from "crypto";
import { Task } from "../Common/Task";
import { Result } from "../Common/Result";

export class SecureTask implements Task {
  // 暗号化キー
  private static readonly ENCRYPTION_KEY = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_SECRET || "")
    .digest();
  private static readonly ENCRYPTION_ALGORITHM = "aes-256-ctr";

  // TaskResults Key
  static readonly ENCRYPTED_PASSWORD = "encryptedPassword";
  static readonly DECRYPTED_PASSWORD = "decryptedPassword";

  // パスワード暗号化
  encryptPassword(password: string): Result<string> {
    const taskResult = new Result<string>();

    try {
      const iv = crypto.randomBytes(16); // 16バイトのIV
      const cipher = crypto.createCipheriv(
        SecureTask.ENCRYPTION_ALGORITHM,
        SecureTask.ENCRYPTION_KEY,
        iv
      );

      let encrypted = cipher.update(password, "utf8", "hex");
      encrypted += cipher.final("hex");

      taskResult.setResultData(
        SecureTask.ENCRYPTED_PASSWORD,
        iv.toString("hex") + encrypted
      );
      taskResult.setResult(Result.OK);
    } catch (error) {
      taskResult.setResult(Result.NG);
      throw new Error("SecureTask.encryptPassword error" , { cause: error });
    }

    return taskResult;
  }

  // パスワード復号化
  decryptPassword(combined: string): Result<string> {
    const taskResult = new Result<string>();

    try {
      const ivHex = combined.slice(0, 32); // 先頭32文字 (16バイト)
      const encrypted = combined.slice(32); // 残りが暗号化パスワード

      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(
        SecureTask.ENCRYPTION_ALGORITHM,
        SecureTask.ENCRYPTION_KEY,
        iv
      );

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      taskResult.setResultData(SecureTask.DECRYPTED_PASSWORD, decrypted);
      taskResult.setResult(Result.OK);
    } catch (error) {
      taskResult.setResult(Result.NG);
      throw new Error("SecureTask.decryptPassword error" , { cause: error });
    }

    return taskResult;
  }
}
