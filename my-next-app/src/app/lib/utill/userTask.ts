import mysql from "mysql2/promise";
import pool from "@/app/lib/db";
import { User } from "@/app/models/User";
import { Result } from "../Common/Result";
import { Task } from "../Common/Task";
import { ErrorCodes } from "../Common/ErrorCodes";

export class UserTask implements Task {
  static readonly findUserByEmailResult = "findUserByEmailResult";

  static async findUserByEmail(email: string): Promise<Result<User>> {
    const result = new Result<User>();

    try {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const userRow = rows[0];

      if (!userRow) {
        result.setResult(Result.NG);
        result.addError({
          field: "email",
          message: "存在しないメールアドレスです。",
        });
        result.setErrorResponse({
          status: ErrorCodes.UNAUTHORIZED.status,
          message: ErrorCodes.UNAUTHORIZED.message,
        });
        return result;
      }

      const user: User = {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        password: userRow.password,
        created_at: userRow.created_at,
        updated_at: userRow.updated_at,
        role: userRow.role,
      };

      result.setResult(Result.OK);
      result.setResultData(UserTask.findUserByEmailResult, user);

      return result;
    } catch (error) {
      result.setResult(Result.NG);
      result.addError({
        field: "server",
        message: "予測しないエラーが発生しました。もう一度お試しください。",
      });
      result.setErrorResponse({
        status: ErrorCodes.SERVER_ERROR.status,
        message: ErrorCodes.SERVER_ERROR.message,
      });
      console.error("userTask.findUserByEmail DB error:", error);
      return result;
    }
  }
}
