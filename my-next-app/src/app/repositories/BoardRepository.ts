/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/app/lib/db";
import { Board } from "@/app/models/Board";
import { RowDataPacket } from "mysql2";

export class BoardRepository {
  static readonly limit: number = 10;

  static async findAll(offset: number): Promise<Board[]> {
    const [rows] = await pool.query(
      `
      SELECT b.id, b.category, b.title, b.content, b.like_count, b.views, 
             b.created_at, b.updated_at, u.name AS author
      FROM boards b
      JOIN users u ON b.users_id = u.id
      ORDER BY b.created_at DESC LIMIT 9 OFFSET ?;
    `,
      [offset]
    );
    return (rows as Board[]).map((row) => new Board(row));
  }

  static async findAllCount(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) as count
      FROM boards;
    `);
  
    return rows[0].count;
  }
}

export default BoardRepository;
