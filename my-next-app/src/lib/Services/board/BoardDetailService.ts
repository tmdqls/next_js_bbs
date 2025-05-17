import { Result } from "@/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { BoardTask } from "@/lib/task/BoardTask";
import { Board } from "@/models/Board";
import { boardIdSchema } from "@/schemas/BoardSchema";
import { UserTask } from "@/lib/task/UserTask";
import { User } from "@/models/User";
import { LikeUtill } from "@/lib/utill/LikeUtill";

export class BoardDetailService extends AbstractService {
  schema = boardIdSchema;

  async editData(): Promise<boolean> {
    const { boardId, userId } = this.getInputData() as {
      boardId: number,
      userId: number
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // 掲示物取得
      const getboardResult = await BoardTask.getBoardById(conn, boardId);

      if (getboardResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of getboardResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(getboardResult.getErrorResponse());
        return false;
      }
      const board = getboardResult.getResultData(BoardTask.BOARD) as Board;

      this.setOutputData(AppSymbol.BOARD, board);
      // 掲示物作成者情報取得
      const boardAuthorResult = await UserTask.findUserById(
        conn,
        Number(board.users_id)
      );

      if (boardAuthorResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of boardAuthorResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(boardAuthorResult.getErrorResponse());
        return false;
      }

      const boardAuthor = boardAuthorResult.getResultData(
        UserTask.FIND_USER_BY_ID_RESULT
      ) as User;

      this.setOutputData(AppSymbol.BOARD_AUTHOR, boardAuthor);

      // いいね取得
      let isLike = false;
      if(userId !== 0){
        //サインインしている場合のみ実行
        isLike = await LikeUtill.checkDuplicate(conn, userId, boardId);
  
        this.setOutputData(AppSymbol.BOARD_LIKE_STATUS, isLike);
      }

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("BoardListService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.BOARD,
      this.getOutputData(AppSymbol.BOARD)
    );
    servicesResult.setResultData(
      AppSymbol.BOARD_AUTHOR,
      this.getOutputData(AppSymbol.BOARD_AUTHOR)
    );
    servicesResult.setResultData(
      AppSymbol.BOARD_LIKE_STATUS,
      this.getOutputData(AppSymbol.BOARD_LIKE_STATUS)
    );

    servicesResult.setResult(Result.OK);
    return true;
  }
}
