import { NextRequest, NextResponse } from "next/server";
import { JWTTokenManagerTask } from "@/app/lib/utill/JWTTokenManager";
import { TaskResult } from "@/app/lib/Common/TaskResult";
import { ErrorCodes } from "@/app/lib/Common/ErrorCodes";

export async function POST(req: NextRequest) {
  
  let taskResult: TaskResult;
  
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const jWTTokenManagerTask = new JWTTokenManagerTask();
  

  try {
    taskResult = await jWTTokenManagerTask.generateRefreshToken(
      email
    );
  } catch {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.USER_NOT_FOUND.code,
          message: ErrorCodes.USER_NOT_FOUND.message,
        },
      },
      { status: ErrorCodes.USER_NOT_FOUND.status }
    );
  }

  const refreshToken = taskResult.getTaskResults(
    JWTTokenManagerTask.REFRESH_TOKEN
  );

  try {
    taskResult = jWTTokenManagerTask.generateAccessToken(
      refreshToken
    );
  } catch {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.INVALID_TOKEN.code,
          message: ErrorCodes.INVALID_TOKEN.message,
        },
      },
      { status: ErrorCodes.INVALID_TOKEN.status }
    );
  }

  const accessToken = taskResult.getTaskResults(
    JWTTokenManagerTask.REFRESH_TOKEN
  );

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
