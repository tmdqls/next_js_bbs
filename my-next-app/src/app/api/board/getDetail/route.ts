import { NextResponse } from "next/server";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import { Result } from "@/lib/Common/Result";
import pool from "@/lib/db";
import { BoardDetailService } from "@/lib/Services/board/BoardDetailService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = Number(searchParams.get(AppSymbol.BOARD_ID));
  const userId = Number(searchParams.get(AppSymbol.USER_ID));

  const inputData = {
    boardId: boardId,
    userId: userId,
  };

  const boardDetailService = new BoardDetailService();
  // 入力データセット
  boardDetailService.setInputData(inputData);
  // DB接続
  const conn = await pool.getConnection();
  boardDetailService.setConnection(conn);

  const boardListResult = await boardDetailService.execute();

  if (boardListResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: boardListResult.getErrorResponse().message,
        error: boardListResult.getErrors(),
      },
      {
        status: boardListResult.getErrorResponse().status,
      }
    );
  }

  return NextResponse.json({
    [AppSymbol.BOARD]: boardListResult.getResultData(AppSymbol.BOARD),
    [AppSymbol.BOARD_AUTHOR]: boardListResult.getResultData(
      AppSymbol.BOARD_AUTHOR
    ),
    [AppSymbol.BOARD_LIKE_STATUS]: boardListResult.getResultData(
      AppSymbol.BOARD_LIKE_STATUS
    ),
  });
}
