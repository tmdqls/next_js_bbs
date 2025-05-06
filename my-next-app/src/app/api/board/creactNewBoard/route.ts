import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import mysql from "mysql2/promise";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET ?? '';

export async function POST(req: NextRequest) {
  const connection = await db.getConnection();

  try {

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    const users_id = decoded.id;

    const { title, category, content } = await req.json();

    if (!title || !category || !content || !users_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const query = `
      INSERT INTO boards (title, category, content, users_id)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute<mysql.ResultSetHeader>(query, [
      title,
      category,
      content,
      users_id,
    ]);

    return NextResponse.json({ message: "投稿成功", id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("API /boards POST error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  } finally {
    connection.release();
  }
}