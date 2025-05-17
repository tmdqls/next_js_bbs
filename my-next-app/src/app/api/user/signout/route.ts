import { NextResponse } from "next/server";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";

export async function POST() {
  const response = NextResponse.json({ message: "sign out" });

  response.cookies.set(AppSymbol.REFRESH_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set(AppSymbol.ACCESS_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
