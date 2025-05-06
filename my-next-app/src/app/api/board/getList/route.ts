import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = 9;
  const offset = (page - 1) * limit;

  const connection = await db.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM boards ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("API /boards error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  } finally {
    connection.release();
  }
}