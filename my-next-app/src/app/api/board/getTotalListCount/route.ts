import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import mysql from "mysql2/promise";

export async function GET() {
  const connection = await db.getConnection();

  try {
    const [rows] = await connection.execute('SELECT COUNT(*) AS total FROM boards');
    const totalCount = (rows as mysql.RowDataPacket[])[0]?.total || 0;
    return NextResponse.json({ totalPages: Math.ceil(totalCount / 9) });
  } catch (error) {
    console.error("API /boards/total error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  } finally {
    connection.release();
  }
}