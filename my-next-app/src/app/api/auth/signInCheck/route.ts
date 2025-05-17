import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_ACCESS_SECRET ?? '';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  console.log(token, 'token');
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ message: "Authenticated", user: decoded }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}