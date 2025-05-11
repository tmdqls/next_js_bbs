import jwt from "jsonwebtoken";
import { UserJwtPayload } from "@/app/models/UserJwtPayload";
import { Task } from "../Common/Task";
import { Result } from "../Common/Result";
import { UserTask } from "./UserTask";
import { ErrorCodes } from "../Common/ErrorCodes";
import { User } from "@/app/models/User";
import mysql from "mysql2/promise";

export class JWTTokenManagerTask implements Task {
  // トークンシークレット
  private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

  // TaskResults Key
  static readonly ACCESS_TOKEN = "accessToken";
  static readonly REFRESH_TOKEN = "refreshToken";

  // アクセストークン生成
  generateAccessToken(refreshToken: string): Result<string> {
    const taskResult = new Result<string>();

    // リフレッシュトークンチェック
    if(!JWTTokenManagerTask.verifyRefreshToken(refreshToken)) {
      taskResult.addError({
        field: "refreshToken",
        message: "トークン情報が正しくありません。",
      });
      taskResult.setResult(Result.NG);
      taskResult.setErrorResponse(ErrorCodes.INVALID_TOKEN);
      return taskResult;
      
    }

    try {
      // アクセストークン生成
      const refreshPayload = jwt.decode(refreshToken) as UserJwtPayload;
      const payload : UserJwtPayload = {
        id: refreshPayload.id,
        email: refreshPayload.email,
        name: refreshPayload.name,
        role: refreshPayload.role,
      };
      const accessToken = jwt.sign(payload, JWTTokenManagerTask.ACCESS_SECRET, {
        expiresIn: "15m",
      });
      taskResult.setResultData(JWTTokenManagerTask.ACCESS_TOKEN, accessToken);
      taskResult.setResult(Result.OK);
    } catch (error) {
      taskResult.setResult(Result.NG);
      throw new Error("JWTTokenManagerTask.generateAccessToken error",{ cause: error });
    }

    return taskResult;
  }

  // リフレッシュトークン生成
  async generateRefreshToken(conn : mysql.Connection ,email: string): Promise<Result<string>> {
    const taskResult = new Result<string>();

    // ユーザー情報取得
    const user = await UserTask.findUserByEmail(conn, email);

    if (user.getResult() === Result.NG) {
      taskResult.setResult(Result.NG);
      for (const err of user.getErrors()) {
        taskResult.addError(err);
      }
      taskResult.setErrorResponse(user.getErrorResponse());
      return taskResult;
    }

    try {
      // リフレッシュトークン生成
      const userData: User = user.getResultData(
        UserTask.FIND_USER_BY_EMAIL_RESULT
      ) as User;

      const payload: UserJwtPayload = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      };

      const refreshToken = jwt.sign(
        payload,
        JWTTokenManagerTask.REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      taskResult.setResultData(JWTTokenManagerTask.REFRESH_TOKEN, refreshToken);
      taskResult.setResult(Result.OK);
    } catch (error) {
      taskResult.setResult(Result.NG);
      throw new Error("JWTTokenManagerTask.generateRefreshToken error",{ cause: error });
    }

    return taskResult;
  }

  // アクセストークンチェック
  static verifyAccessToken(token: string): boolean {
    try {
      jwt.verify(token, this.ACCESS_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  // リフレッシュトークンチェック
  static verifyRefreshToken(token: string): boolean {
    try {
      jwt.verify(token, this.REFRESH_SECRET);
      return true;
    } catch {
      return false;
    }
  }
}
