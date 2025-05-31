import { NextRequest, NextResponse } from "next/server";
import { GetAccessTokenService } from "@/lib/Services/auth/GetAccessTokenService";
import { Result } from "@/lib/Common/Result";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  body.refreshToken = req.cookies.get("refreshToken")?.value;
  
  const getAccessTokenService = new GetAccessTokenService();
  getAccessTokenService.setConnection(await pool.getConnection());
  getAccessTokenService.setInputData(body);

  const getAccessTokenResult = await getAccessTokenService.execute();

  if (getAccessTokenResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: getAccessTokenResult.getErrorResponse().message,
        error: getAccessTokenResult.getErrors(),
      },
      {
        status: getAccessTokenResult.getErrorResponse().status,
      }
    );
  }

  const response = NextResponse.json({
    [AppSymbol.ACCESS_TOKEN]: getAccessTokenResult.getResultData(
      AppSymbol.ACCESS_TOKEN
    ),
  });

  response.cookies.set(
    AppSymbol.ACCESS_TOKEN,
    getAccessTokenResult.getResultData(AppSymbol.ACCESS_TOKEN) as string,
    {
      httpOnly: false,
      // secure: process.env.NODE_ENV === "production",
      // HTTP専用なのでfalseにする
      secure: false,
      sameSite: "strict",
      path: "/",
    }
  );
  return response;
}
