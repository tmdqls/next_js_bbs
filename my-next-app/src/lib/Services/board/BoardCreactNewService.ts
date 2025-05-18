import { Result } from "@/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { BoardTask } from "@/lib/task/BoardTask";
import { BoardCreateSchema } from "@/schemas/BoardSchema";
import jwt from "jsonwebtoken";
import { UserJwtPayload } from "@/models/UserJwtPayload";

export class BoardCreactNewService extends AbstractService {
  schema = BoardCreateSchema;

  async editData(): Promise<boolean> {
    const { title, category, content, accessToken } = this.getInputData() as {
      title: string;
      category: string;
      content: string;
      accessToken: string;
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // ユーザー情報取得
      const playload = jwt.decode(accessToken) as UserJwtPayload;

      // 掲示物作成
      const createBoardResult = await BoardTask.createBoard(
        conn,
        playload.id,
        title,
        category,
        content
      );

      const newBoardId = createBoardResult.getResultData(
        BoardTask.CREATED_BOARD_ID
      ) as number;

      this.setOutputData(AppSymbol.CREATED_BOARD_ID, newBoardId);

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("BoardListService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.CREATED_BOARD_ID,
      this.getOutputData(AppSymbol.CREATED_BOARD_ID)
    );

    servicesResult.setResult(Result.OK);
    return true;
  }
}
