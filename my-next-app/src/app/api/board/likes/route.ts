import { NextRequest, NextResponse } from "next/server";
import { Result } from "@/app/lib/Common/Result";
import { BoardLikeService } from "@/app/lib/Services/board/BoardLikeService";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const boardLikeService = new BoardLikeService();
  // リクエストボディをサービスに渡す
  boardLikeService.setInputData(body);
  // DB接続
  const conn = await pool.getConnection();
  boardLikeService.setConnection(conn);

  const boardLikeResult = await boardLikeService.execute();

  if (boardLikeResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: boardLikeResult.getErrorResponse().message,
        error: boardLikeResult.getErrors(),
      },
      {
        status: boardLikeResult.getErrorResponse().status,
      }
    );
  }

  const response = NextResponse.json({
    message: "Likes successful",
  });

  return response;
}
