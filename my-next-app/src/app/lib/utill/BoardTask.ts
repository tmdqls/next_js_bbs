import mysql from "mysql2/promise";
import pool from "@/app/lib/db";
import { Result } from "../Common/Result";
import { Task } from "../Common/Task";
import { ErrorCodes } from "../Common/ErrorCodes";
import { Board } from "@/app/models/Board";
import { BoardListOptions } from "@/app/models/Board";

export class BoardTask implements Task {
  static readonly BOARD_LIST = "boardList";
  static readonly BOARD_LIST_TOTAL_COUNT = "boardListTotalCount";

  // 1ページに表示する掲示物の数
  private static readonly PAGE_SIZE = 9;

  static async getBoardList(
    pageNum: number,
    options?: BoardListOptions
  ): Promise<Result<Board[]>> {
    const result = new Result<Board[]>();

    try {
      const { category, sort = "newest", search, searchField } = options || {};
      const queryParams: (string | number)[] = [];
      const conditions: string[] = [];

      let query = `SELECT * FROM boards`;

      // カテゴリフィルター
      if (category) {
        conditions.push(`category = ?`);
        queryParams.push(category);
      }

      // 検索条件フィルター
      if (search) {
        const keyword = `%${search}% `;

        switch (searchField) {
          case "title":
            conditions.push(`title LIKE ?`);
            queryParams.push(keyword);
            break;
          case "content":
            conditions.push(`content LIKE ?`);
            queryParams.push(keyword);
            break;
          case "author":
            conditions.push(
              `users_id IN (SELECT id FROM users WHERE name LIKE ?)`
            );
            queryParams.push(keyword);
            break;
        }
      }

      // where
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      // orderby
      const orderBy = sort === "oldest" ? "updated_at ASC" : "updated_at DESC";
      query += ` ORDER BY ${orderBy}`;

      // ページネーション
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(
        BoardTask.PAGE_SIZE,
        (pageNum - 1) * BoardTask.PAGE_SIZE
      );

      const [rows] = await pool.query<mysql.RowDataPacket[]>(
        query,
        queryParams
      );

      if (!rows || rows.length === 0) {
        result.setResult(Result.NG);
        result.addError({
          field: "pageNum",
          message: "該当する掲示物が見つかりません。",
        });
        result.setErrorResponse({
          status: ErrorCodes.NOT_FOUND.status,
          message: ErrorCodes.NOT_FOUND.message,
        });
        return result;
      }

      result.setResultData(BoardTask.BOARD_LIST, rows as Board[]);
      result.setResult(Result.OK);
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
      console.error("BoardTask.getBoardList DB error:", error);
      return result;
    }
  }

  static async getBoardListTotalCount(
    options?: BoardListOptions
  ): Promise<Result<number>> {
    const result = new Result<number>();
    const conditions: string[] = [];
    const params: string[] = [];

    const { category, search, searchField } = options || {};

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (search && searchField) {
      if (searchField === "author") {
        conditions.push(
          "users_id IN (SELECT id FROM users WHERE username LIKE ?)"
        );
        params.push(`%${search}%`);
      } else {
        conditions.push(`${searchField} LIKE ?`);
        params.push(`%${search}%`);
      }
    }

    let query = "SELECT COUNT(*) AS total FROM boards";
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    try {
      const [rows] = await pool.query<mysql.RowDataPacket[]>(query, params);
      const totalCount = rows[0]?.total;

      if (!totalCount) {
        result.setResult(Result.NG);
        result.addError({
          field: "pageNum",
          message: "該当する掲示物が見つかりません。",
        });
        result.setErrorResponse({
          status: ErrorCodes.NOT_FOUND.status,
          message: ErrorCodes.NOT_FOUND.message,
        });
        return result;
      }

      const totalPages = Math.ceil(totalCount / BoardTask.PAGE_SIZE);
      result.setResultData(BoardTask.BOARD_LIST_TOTAL_COUNT, totalPages);

      result.setResult(Result.OK);
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
      console.error("boardTask.getBoardListTotalCount DB error:", error);
      return result;
    }
  }
}
