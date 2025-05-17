import mysql from "mysql2/promise";

export class BoardUtill {
  /**
   * 掲示物存在チェック
   *
   * @param conn - DB接続情報
   * @param id - 掲示物ID
   * @returns 存在する場合 true, そうでない場合 false
   */
  static async isExist(
    conn: mysql.Connection,
    id: number
  ): Promise<boolean> {
    const checkQuery = `
      SELECT 1 FROM boards
      WHERE id = ?
      LIMIT 1
    `;

    try {
      const [rows] = await conn.query<mysql.RowDataPacket[]>(checkQuery, [id]);
      return rows.length > 0;
    } catch (error) {
      throw new Error("BoardUtill.isExist error", { cause: error });
    }
  }
}