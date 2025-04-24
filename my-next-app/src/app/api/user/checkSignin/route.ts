import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token : string = req.cookies.get("token")?.value || "";

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "");
    return NextResponse.json({ message: "Logged in", user });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}