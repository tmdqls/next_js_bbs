import mysql from "mysql2/promise";
import { User } from "@/models/User";
import { Result } from "../Common/Result";
import { Task } from "../Common/Task";
import { ErrorCodes } from "../Common/ErrorCodes";

export class UserTask implements Task {
  static readonly FIND_USER_BY_EMAIL_RESULT = "findUserByEmailResult";
  static readonly FIND_USER_BY_ID_RESULT = "findUserByIdResult";
  static readonly SIGN_UP_USER_RESULT = "signUpUserResult";

  /**
   * ユーザーEmailによる検索
   *
   * @param userId - ユーザーEmail
   * @returns Result<User>
   *
   */
  static async findUserByEmail(
    con: mysql.Connection,
    email: string
  ): Promise<Result<User>> {
    const result = new Result<User>();

    try {
      const [rows] = await con.query<mysql.RowDataPacket[]>(
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
      result.setResultData(UserTask.FIND_USER_BY_EMAIL_RESULT, user);

      return result;
    } catch (error) {
      result.setResult(Result.NG);
      throw new Error("UserTask.findUserByEmail error", { cause: error });
    }
  }

  /**
   * ユーザーidによる検索
   *
   * @param userId - ユーザーid
   * @returns Result<User>
   *
   */
  static async findUserById(
    con: mysql.Connection,
    userId: number
  ): Promise<Result<User>> {
    const result = new Result<User>();

    try {
      const [rows] = await con.query<mysql.RowDataPacket[]>(
        "SELECT id, email, name FROM users WHERE id = ?",
        [userId]
      );

      const userRow = rows[0];

      if (!userRow) {
        result.setResult(Result.NG);
        result.addError({
          field: "userId",
          message: "該当するユーザーが見つかりません。",
        });
        result.setErrorResponse({
          status: ErrorCodes.NOT_FOUND.status,
          message: ErrorCodes.NOT_FOUND.message,
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

      result.setResultData(UserTask.FIND_USER_BY_ID_RESULT, user);
      result.setResult(Result.OK);

      return result;
    } catch (error) {
      result.setResult(Result.NG);
      throw new Error("UserTask.findUserById error", { cause: error });
    }
  }

  /**
   * ユーザー登録
   *
   * @param userId - ユーザーid
   * @returns Result<User>
   *
   */
  static async signUpUser(con: mysql.Connection, userEmail: string, userPassword: string, name: string): Promise<Result> {
    const result = new Result();

    try {
      const [rows] = await con.query<mysql.ResultSetHeader>(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [userEmail, userPassword, name]
      );

      if (rows.affectedRows === 0) {
        result.setResult(Result.NG);
        result.addError({
          field: "email",
          message: "登録に失敗しました。",
        });
        result.setErrorResponse({
          status: ErrorCodes.SERVER_ERROR.status,
          message: ErrorCodes.SERVER_ERROR.message,
        });
        return result;
      }

      result.setResultData(UserTask.SIGN_UP_USER_RESULT, "Login successful");
      result.setResult(Result.OK);
      return result;
    } catch (error) {
      result.setResult(Result.NG);
      throw new Error("UserTask.Insert error", { cause: error });
    }
  }
}
