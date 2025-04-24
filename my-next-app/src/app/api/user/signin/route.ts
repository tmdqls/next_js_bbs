import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import pool from "@/app/lib/db";

const SECRET : string = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = (rows as mysql.RowDataPacket[])[0];
  if (!user || user.password !== password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  console.log(user)
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

  const response = NextResponse.json({
    message: "Login successful",
    id: user.id,
    email: user.email,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}