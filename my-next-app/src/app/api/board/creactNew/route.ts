import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { BoardCreactNewService } from "@/lib/Services/board/BoardCreactNewService";
import { Result } from "@/lib/Common/Result";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const authHeader = req.headers.get("authorization") ?? "";
  const accessToken = authHeader.split(" ")[1];

  body.accessToken = accessToken;

  const boardCreateService = new BoardCreactNewService();
  // リクエストボディをサービスに渡す
  boardCreateService.setInputData(body);
  // DB接続
  boardCreateService.setConnection(await db.getConnection());

  const boardCreateResult = await boardCreateService.execute();

  if (boardCreateResult.getResult() === Result.NG) {
    return NextResponse.json(
      {
        message: boardCreateResult.getErrorResponse().message,
        error: boardCreateResult.getErrors(),
      },
      {
        status: boardCreateResult.getErrorResponse().status,
      }
    );
  }

  const response = NextResponse.json({
    [AppSymbol.CREATED_BOARD_ID]:boardCreateResult.getResultData(AppSymbol.CREATED_BOARD_ID),
  });
  return response;
}
