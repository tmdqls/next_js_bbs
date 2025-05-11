import mysql from "mysql2/promise";

export class LikeUtill {
  /**
   * いいね重複チェック
   *
   * @param userId ユーザーID
   * @param boardId 掲示板ID
   * @returns いいねされている場合 true, そうでない場合 false
   */
  static async checkDuplicate(
    conn: mysql.Connection,
    userId: number,
    boardId: number
  ): Promise<boolean> {
    const checkQuery = `SELECT 1 FROM likes WHERE user_id = ? AND board_id = ? LIMIT 1`;

    try {
      const [rows] = await conn.query<mysql.RowDataPacket[]>(checkQuery, [
        userId,
        boardId,
      ]);
      return rows.length > 0;
    } catch (error) {
      throw new Error("LikeUtill.checkDuplicate error", { cause: error });
    }
  }

  /**
   * いいねをデータベースに挿入する
   *
   * @param userId - ユーザーID
   * @param boardId - 掲示板ID
   * @returns void
   */
  static async insertLike(
    conn: mysql.Connection,
    userId: number,
    boardId: number
  ): Promise<void> {
    const insertQuery = `INSERT INTO likes (user_id, board_id) VALUES (?, ?)`;

    try {
      await conn.query(insertQuery, [userId, boardId]);
    } catch (error) {
      throw new Error("LikeUtill.insertLike error", { cause: error });
    }
  }
  /**
   * いいねをデータベースから削除する
   *
   * @param userId - ユーザーID
   * @param boardId - 掲示板ID
   * @returns void
   */
  static async deleteLike(
    conn: mysql.Connection,
    userId: number,
    boardId: number
  ): Promise<void> {
    const deleteQuery = `DELETE FROM likes WHERE user_id = ? AND board_id = ?`;

    try {
      await conn.query(deleteQuery, [userId, boardId]);

    } catch (error) {
      throw new Error("LikeUtill.deleteLike error", { cause: error });
    }
  }
}
