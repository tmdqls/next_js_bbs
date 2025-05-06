import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import mysql from "mysql2/promise";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  const connection = await db.getConnection();

  try {
    const [rows] = await connection.execute(
      "SELECT * FROM boards WHERE id = ?",
      [id]
    );

    const board = (rows as mysql.RowDataPacket[])[0];

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("API /boards GET error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  } finally {
    connection.release();
  }
}