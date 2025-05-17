import { NextRequest, NextResponse } from "next/server";
import { AuthTokenService } from "@/lib/Services/auth/AuthTokenService";
import { Result } from "@/lib/Common/Result";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";

export async function POST(req: NextRequest) {
  const body = await req.json();
  body.refreshToken = req.cookies.get('refreshToken')?.value;

  const authTokenService = new AuthTokenService();
  authTokenService.setInputData(body);

  const authTokenResult = await authTokenService.execute();

  if (authTokenResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: authTokenResult.getErrorResponse().message,
        error: authTokenResult.getErrors(),
      },
      {
        status: authTokenResult.getErrorResponse().status,
      }
    );
  }

  return NextResponse.json(authTokenResult.getResultData(AppSymbol.ACCESS_TOKEN));  
}
