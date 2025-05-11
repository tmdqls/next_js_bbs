import { NextResponse } from "next/server";
import { BoardListService } from "@/app/lib/Services/board/BoardListService";
import { AppSymbol } from "@/app/lib/Simbol/AppSymbol";
import { Result } from "@/app/lib/Common/Result";
import pool from "@/app/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageNum = Number(searchParams.get(AppSymbol.BOARD_PAGE));
  const options = {
    category: searchParams.get(AppSymbol.BOARD_CATEGORY),
    sort: searchParams.get(AppSymbol.BOARD_SORT),
    search: searchParams.get(AppSymbol.BOARD_SEARCH),
    searchField: searchParams.get(AppSymbol.BOARD_SEARCH_FIELD),
  };
  const inputData = {
    pageNum: pageNum,
    options: options,
  };

  const boardListService = new BoardListService();
  // 入力データセット
  boardListService.setInputData(inputData);
  // DB接続
  const conn = await pool.getConnection();
  boardListService.setConnection(conn);

  const boardListResult = await boardListService.execute();

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
    [AppSymbol.BOARD_LIST_TOTAL_COUNT]: boardListResult.getResultData(
      AppSymbol.BOARD_LIST_TOTAL_COUNT
    ),
    [AppSymbol.BOARD_LIST]: boardListResult.getResultData(AppSymbol.BOARD_LIST),
  });
}
