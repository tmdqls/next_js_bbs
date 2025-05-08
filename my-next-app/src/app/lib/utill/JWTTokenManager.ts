import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { UserJwtPayload } from "@/app/models/UserJwtPayload";
import { Task } from "../Common/Task";
import { TaskResult } from "../Common/TaskResult";
import mysql from "mysql2/promise";
import pool from "@/app/lib/db";

export class JWTTokenManagerTask implements Task {

  // トークンシークレット
  private static readonly ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || "";
  private static readonly REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "";

  // TaskResults Key
  static readonly ACCESS_TOKEN = "accessToken";
  static readonly REFRESH_TOKEN = "refreshToken";

  private async getUserData(email: string): Promise<UserJwtPayload> {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = (rows as mysql.RowDataPacket[])[0];

    const payload : UserJwtPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
    
    return payload;
  }

  // アクセストークン生成
  generateAccessToken(refreshToken : string): TaskResult {

    const taskResult = new TaskResult();

    try {

      const decodedPayload = jwt.decode(refreshToken);

      let payload: string = "";
      if (typeof decodedPayload === 'string') {
        payload = decodedPayload;
      }else{
        taskResult.addError({ field: "refreshToken", message: "リフレッシュトークン情報が読み取れませんでした。" });
        taskResult.setTaskResult(TaskResult.NG);
        console.error("generateAccessToken error");
      }

      taskResult.setTaskResults(JWTTokenManagerTask.ACCESS_TOKEN,
      jwt.sign(payload, JWTTokenManagerTask.ACCESS_SECRET, { expiresIn: "15m" }));
      taskResult.setTaskResult(TaskResult.OK);
    
    } catch (error) {
      taskResult.addError({ field: "refreshToken", message: "アクセストークン生成に失敗しました。" });
      taskResult.setTaskResult(TaskResult.NG);
      console.error(error);
    }

    return taskResult;
  }

  // リフレッシュトークン生成
  async generateRefreshToken(email: string): Promise<TaskResult> {

    const taskResult = new TaskResult();
  
    try {
      const payload = await this.getUserData(email);

      const refreshToken = jwt.sign(payload, JWTTokenManagerTask.REFRESH_SECRET, { expiresIn: "7d" });
      taskResult.setTaskResults(JWTTokenManagerTask.REFRESH_TOKEN, refreshToken);
      taskResult.setTaskResult(TaskResult.OK);
    } catch (error) {
      taskResult.addError({ field: "email", message: "リフレッシュトークン生成に失敗しました。" });
      taskResult.setTaskResult(TaskResult.NG);
      console.error(error);
    }
  
    return taskResult;
  }

  // アクセストークンチェック
  static verifyAccessToken(token: string): boolean {
    try {
      jwt.verify(token, this.ACCESS_SECRET);
      return true; 
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        console.error('Invalid access token', err.message);
        return false;
      }
      if (err instanceof TokenExpiredError) {
        console.error('Token has expired', err.message);
        return false;
      }
      if (err instanceof NotBeforeError) {
        console.error('Token is not yet active', err.message);
        return false;
      }
      throw new Error('Token verification failed');
    }
  }

  // リフレッシュトークンチェック
  static verifyRefreshToken(token: string): boolean {
    try {
      jwt.verify(token, this.REFRESH_SECRET);
      return true; 
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        console.error('Invalid access token', err.message);
        return false;
      }
      if (err instanceof TokenExpiredError) {
        console.error('Token has expired', err.message);
        return false;
      }
      if (err instanceof NotBeforeError) {
        console.error('Token is not yet active', err.message);
        return false;
      }
      throw new Error('Token verification failed');
    }
  }

}