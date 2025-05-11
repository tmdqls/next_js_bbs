import { NextRequest, NextResponse } from "next/server";
import { Result } from "@/app/lib/Common/Result";
import { SignInService } from "@/app/lib/Services/user/SignInService";
import { AppSymbol } from "@/app/lib/Simbol/AppSymbol";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signInService = new SignInService();
  // リクエストボディをサービスに渡す
  signInService.setInputData(body);
  // DB接続
  const conn = await pool.getConnection();
  signInService.setConnection(conn);

  const signInResult = await signInService.execute();

  if (signInResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: signInResult.getErrorResponse().message,
        error: signInResult.getErrors(),
      },
      {
        status: signInResult.getErrorResponse().status,
      }
    );
  }

  const response = NextResponse.json({
    message: "Login successful",
    id: signInResult.getResultData(AppSymbol.USER_ID),
    email: signInResult.getResultData(AppSymbol.USER_EMAIL),
    name: signInResult.getResultData(AppSymbol.USER_NAME),
    role: signInResult.getResultData(AppSymbol.USER_ROLE),
  });

  response.cookies.set(
    AppSymbol.REFRESH_TOKEN,
    signInResult.getResultData(AppSymbol.REFRESH_TOKEN) as string,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    }
  );

  response.cookies.set(
    AppSymbol.ACCESS_TOKEN,
    signInResult.getResultData(AppSymbol.ACCESS_TOKEN) as string,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    }
  );

  return response;
}
