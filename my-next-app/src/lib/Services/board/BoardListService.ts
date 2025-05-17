import { Result } from "@/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { z } from "zod";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { BoardTask } from "@/lib/task/BoardTask";
import { BoardListOptions, Board } from "@/models/Board";
import { PageSchema, OptionsSchema } from "@/schemas/BoardSchema";

export class BoardListService extends AbstractService {
  schema = z.object({
    pageNum: PageSchema,
    options: OptionsSchema,
  });

  async editData(): Promise<boolean> {
    const { pageNum, options } = this.getInputData() as {
      pageNum: number;
      options: BoardListOptions;
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // トータルボード数取得
      const boardCountResult = await BoardTask.getBoardListTotalCount(
        conn,
        options
      );

      if (boardCountResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of boardCountResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(boardCountResult.getErrorResponse());
        return false;
      }

      const totalBoardCount = boardCountResult.getResultData(
        BoardTask.BOARD_LIST_TOTAL_COUNT
      ) as number;

      this.setOutputData(AppSymbol.BOARD_LIST_TOTAL_COUNT, totalBoardCount);

      // ボードリスト取得
      const boardTaskResult = await BoardTask.getBoardList(
        conn,
        pageNum,
        options
      );

      if (boardTaskResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of boardTaskResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(boardTaskResult.getErrorResponse());
        return false;
      }

      const boardList = boardTaskResult.getResultData(
        BoardTask.BOARD_LIST
      ) as Board[];

      this.setOutputData(AppSymbol.BOARD_LIST, boardList);

      return true;
    } catch(error) {
      servicesResult.setResult(Result.NG);
      throw new Error("BoardListService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.BOARD_LIST_TOTAL_COUNT,
      this.getOutputData(AppSymbol.BOARD_LIST_TOTAL_COUNT)
    );
    servicesResult.setResultData(
      AppSymbol.BOARD_LIST,
      this.getOutputData(AppSymbol.BOARD_LIST)
    );

    servicesResult.setResult(Result.OK);
    return true;
  }
}
