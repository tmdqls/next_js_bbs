import mysql from "mysql2/promise";
import { Board } from "@/app/models/Board";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123123",
  database: "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 5,
});

export const getBoardList = async (page: number): Promise<Board[]> => {
  const connection = await db.getConnection();
  const limit : number = 9;
  const offset : number = (page - 1) * limit;

  try {
    const [rows] = await connection.execute(
        `SELECT * FROM boards ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
      );
      return rows as Board[];
  } catch (error) {
    console.error("getBoardList error:", error);
    return [];
  } finally {
    connection.release();
  }
};

export const getTotalPages = async (): Promise<number> => {
    const connection = await db.getConnection();
    const limit : number = 9;

    try {
      const [rows] = await connection.execute('SELECT COUNT(*) AS total FROM boards');
      const totalCount = (rows as mysql.RowDataPacket[])[0]?.total || 0; 
      return Math.ceil(totalCount / limit);
    } catch (error) {
      console.error('getTotalPages error:', error);
      return 0;
    } finally {
      connection.release();
    }
  };