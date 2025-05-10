import { NextRequest, NextResponse } from "next/server";
import { Result } from "@/app/lib/Common/Result";
import { ErrorCodes } from "@/app/lib/Common/ErrorCodes";
import { UserServices } from "@/app/lib/Services/UserServices";
import { AppSymbol } from "@/app/lib/Simbol/AppSymbol";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userServices = new UserServices();
  userServices.setInputData(body);
  
  const servicesResult = await userServices.execute();

  if (servicesResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message:
          servicesResult.getErrorResponse()?.message ??
          ErrorCodes.SERVER_ERROR.message,
        error: servicesResult.getErrors(),
      },
      {
        status:
          servicesResult.getErrorResponse()?.status ??
          ErrorCodes.SERVER_ERROR.status,
      }
    );
  }

  const response = NextResponse.json({
    message: "Login successful",
    id: servicesResult.getResultData(AppSymbol.USER_ID),
    email: servicesResult.getResultData(AppSymbol.USER_EMAIL),
    name: servicesResult.getResultData(AppSymbol.USER_NAME),
    role: servicesResult.getResultData(AppSymbol.USER_ROLE),
  });

  response.cookies.set(
    AppSymbol.REFRESH_TOKEN,
    servicesResult.getResultData(AppSymbol.REFRESH_TOKEN) as string,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    }
  );

  response.cookies.set(
    AppSymbol.ACCESS_TOKEN,
    servicesResult.getResultData(AppSymbol.ACCESS_TOKEN) as string,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    }
  );

  return response;
}
