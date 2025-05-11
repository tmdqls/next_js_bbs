import { NextResponse } from "next/server";
import { BoardListService } from "@/app/lib/Services/board/BoardListService";
import { AppSymbol } from "@/app/lib/Simbol/AppSymbol";
import { Result } from "@/app/lib/Common/Result";
import { ErrorCodes } from "@/app/lib/Common/ErrorCodes";

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

  boardListService.setInputData(inputData);

  const boardListResult = await boardListService.execute();

  if (boardListResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message:
          boardListResult.getErrorResponse()?.message ??
          ErrorCodes.SERVER_ERROR.message,
        error: boardListResult.getErrors() ?? ErrorCodes.SERVER_ERROR.detail,
      },
      {
        status:
          boardListResult.getErrorResponse()?.status ??
          ErrorCodes.SERVER_ERROR.status,
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
