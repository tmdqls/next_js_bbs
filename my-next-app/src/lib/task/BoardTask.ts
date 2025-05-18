import mysql from "mysql2/promise";
import { Result } from "../Common/Result";
import { Task } from "../Common/Task";
import { ErrorCodes } from "../Common/ErrorCodes";
import { Board } from "@/models/Board";
import { BoardListOptions } from "@/models/Board";
import { BoardUtill } from "../utill/BoardUtill";
import { LikeUtill } from "../utill/LikeUtill";

export class BoardTask implements Task {
  static readonly BOARD_LIST = "boardList";
  static readonly BOARD_LIST_TOTAL_COUNT = "boardListTotalCount";
  static readonly BOARD = "board";
  static readonly CREATED_BOARD_ID = "createdBoardId";

  // 1ページに表示する掲示物の数
  private static readonly PAGE_SIZE = 9;

  // 掲示板リスト取得
  static async getBoardList(
    conn: mysql.Connection,
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
      const orderBy = sort === "oldest" ? "created_at ASC" : "created_at DESC";
      query += ` ORDER BY ${orderBy}`;

      // ページネーション
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(
        BoardTask.PAGE_SIZE,
        (pageNum - 1) * BoardTask.PAGE_SIZE
      );

      const [rows] = await conn.query<mysql.RowDataPacket[]>(
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
      throw new Error("BoardTask.getBoardList error", { cause: error });
    }
  }

  // トータルぺ゙ード数取得
  static async getBoardListTotalCount(
    conn: mysql.Connection,
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
      const [rows] = await conn.query<mysql.RowDataPacket[]>(query, params);
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
      throw new Error("BoardTask.getBoardListTotalCount error", {
        cause: error,
      });
    }
  }
  /**
   * 指定したIDの掲示物を取得する
   *
   * @param boardId - 掲示物のID
   * @returns Result<Board>
   */
  static async getBoardById(
    conn: mysql.Connection,
    boardId: number
  ): Promise<Result<Board>> {
    const taskResult = new Result<Board>();

    try {
      // 掲示物の存在確認
      const isExist = await BoardUtill.isExist(conn, boardId);
      if (!isExist) {
        taskResult.setResult(Result.NG);
        taskResult.addError({
          field: "boardId",
          message: "該当する掲示物が見つかりません。",
        });
        taskResult.setErrorResponse({
          status: ErrorCodes.NOT_FOUND.status,
          message: ErrorCodes.NOT_FOUND.message,
        });
        return taskResult;
      }

      // 掲示物データを取得
      const [rows] = await conn.query<mysql.RowDataPacket[]>(
        `SELECT * FROM boards WHERE id = ?`,
        [boardId]
      );

      const boardList = rows as Board[];
      const board = boardList[0];

      taskResult.setResultData(BoardTask.BOARD, board);

      taskResult.setResult(Result.OK);
      return taskResult;
    } catch (error) {
      throw new Error("BoardTask.getBoardById error", { cause: error });
    }
  }

  /**
   * 記事の「いいね」数を増減する
   *
   * @param userId - ユーザーID
   * @param boardId - 記事ID
   * @param operation - "add" なら +1、"remove" なら -1
   * @returns 実行成功 OK ,処理失敗 NG
   */
  static async updateLikeCount(
    conn: mysql.Connection,
    userId: number,
    boardId: number,
    operation: "add" | "remove"
  ): Promise<Result> {
    const taskResult = new Result<void>();
    try {
      // 掲示物存在チェック
      const isExist = await BoardUtill.isExist(conn, boardId);

      if (!isExist) {
        taskResult.setResult(Result.NG);
        taskResult.addError({
          field: "boardId",
          message: "該当する掲示物が見つかりません。",
        });
        taskResult.setErrorResponse({
          status: ErrorCodes.NOT_FOUND.status,
          message: ErrorCodes.NOT_FOUND.message,
        });
        return taskResult;
      }

      // like_count 更新
      const increment = operation === "add" ? 1 : -1;
      const updateQuery = `
              UPDATE 
                boards
              SET 
                like_count = like_count + ?
              WHERE 
                id = ?
              `;
      await conn.query(updateQuery, [increment, boardId]);

      // like 更新
      if (operation === "add") {
        await LikeUtill.insertLike(conn, userId, boardId);
      } else {
        await LikeUtill.deleteLike(conn, userId, boardId);
      }

      taskResult.setResult(Result.OK);
      return taskResult;
    } catch (error) {
      throw new Error("BoardTask.updateLikeCount error", { cause: error });
    }
  }

  /**
   * 게시글 작성
   *
   * @param usersId - 作成者id
   * @param title - タイトル
   * @param category - カテゴリ
   * @param content - コンテンツ
   * @returns insertId
   */
  static async createBoard(
    conn: mysql.Connection,
    usersId: number,
    title: string,
    category: string,
    content: string
  ): Promise<Result<number>> {
    const taskResult = new Result<number>();

    try {
      const query = `
        INSERT INTO boards (title, category, content, users_id)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await conn.execute<mysql.ResultSetHeader>(query, [
        title,
        category,
        content,
        usersId,
      ]);

      const insertId = result.insertId;

      taskResult.setResult(Result.OK);
      taskResult.setResultData(BoardTask.CREATED_BOARD_ID, insertId);

      return taskResult;
    } catch (error) {
      throw new Error("BoardTask.createPost error", { cause: error });
    }
  }
}
