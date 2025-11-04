import { NextRequest, NextResponse } from "next/server";
import { Result } from "@/lib/Common/Result";
import { SignUpService } from "@/lib/Services/user/SignUpService";
import { SignInService } from "@/lib/Services/user/SignInService";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signUpService = new SignUpService();
  // リクエストボディをサービスに渡す
  signUpService.setInputData(body);
  // DB接続
  const signUpConn = await pool.getConnection();
  signUpService.setConnection(signUpConn);

  const signUpResult = await signUpService.execute();

  if (signUpResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: signUpResult.getErrorResponse().message,
        error: signUpResult.getErrors(),
      },
      {
        status: signUpResult.getErrorResponse().status,
      }
    );
  }

  const signInService = new SignInService();
  // リクエストボディをサービスに渡す
  signInService.setInputData(body);
  // DB接続
  const signInConn = await pool.getConnection();
  signInService.setConnection(signInConn);

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
    message: signUpResult.getResultData(AppSymbol.USER_SIGN_UP_MSG),
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
      //secure: process.env.NODE_ENV === "production",
      // HTTP専用なのでfalseにする
      secure: false,
      sameSite: "strict",
      path: "/",
    }
  );

  response.cookies.set(
    AppSymbol.ACCESS_TOKEN,
    signInResult.getResultData(AppSymbol.ACCESS_TOKEN) as string,
    {
      httpOnly: false,
      //secure: process.env.NODE_ENV === "production",
      // HTTP専用なのでfalseにする
      secure: false,
      sameSite: "strict",
      path: "/",
    }
  );

  return response;
}
