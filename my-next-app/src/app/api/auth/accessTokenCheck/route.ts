import { NextRequest, NextResponse } from "next/server";
import { AccessTokenCheckService } from "@/lib/Services/auth/AccessTokenCheckService";
import { Result } from "@/lib/Common/Result";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const accessTokenCheckService = new AccessTokenCheckService();
  accessTokenCheckService.setInputData(body);
  accessTokenCheckService.setConnection(await pool.getConnection());
  
  const accessTokenCheckResult = await accessTokenCheckService.execute();
  if (accessTokenCheckResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: accessTokenCheckResult.getErrorResponse().message,
        error: accessTokenCheckResult.getErrors(),
      },
      {
        status: accessTokenCheckResult.getErrorResponse().status,
      }
    );
  }

  const response = NextResponse.json({
    message: "access token check successful",
  });

  return response;
}
