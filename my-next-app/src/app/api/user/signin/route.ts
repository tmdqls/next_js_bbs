import { NextRequest, NextResponse } from "next/server";
import { Result } from "@/app/lib/Common/Result";
import { ErrorCodes } from "@/app/lib/Common/ErrorCodes";
import { SignInService } from "@/app/lib/Services/user/SignInService";
import { AppSymbol } from "@/app/lib/Simbol/AppSymbol";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signInService = new SignInService();
  signInService.setInputData(body);

  const signInResult = await signInService.execute();

  if (signInResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message:
          signInResult.getErrorResponse()?.message ??
          ErrorCodes.SERVER_ERROR.message,
        error: signInResult.getErrors() ?? ErrorCodes.SERVER_ERROR.detail,
      },
      {
        status:
          signInResult.getErrorResponse()?.status ??
          ErrorCodes.SERVER_ERROR.status,
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
