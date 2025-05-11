import { Result } from "@/app/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { BoardTask } from "@/app/lib/task/BoardTask";
import { LikeRequestSchema } from "@/app/schemas/BoardSchema";

export class BoardLikeService extends AbstractService {
  schema = LikeRequestSchema;

  async editData(): Promise<boolean> {
    const { boardId, userId, boardLikeOption } = this.getInputData() as {
      boardId: number;
      userId: number;
      boardLikeOption: "add" | "remove";
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // いいね処理オプションによって処理を分ける
      if (boardLikeOption === "add") {
        const likeResult = await BoardTask.updateLikeCount(
          conn,
          userId,
          boardId,
          "add"
        );
        if (likeResult.getResult() === Result.NG) {
          servicesResult.setResult(Result.NG);
          for (const err of likeResult.getErrors()) {
            servicesResult.addError(err);
          }
          servicesResult.setErrorResponse(likeResult.getErrorResponse());
          return false;
        }
      } else if (boardLikeOption === "remove") {
        const likeResult = await BoardTask.updateLikeCount(
          conn,
          userId,
          boardId,
          "remove"
        );
        if (likeResult.getResult() === Result.NG) {
          servicesResult.setResult(Result.NG);
          for (const err of likeResult.getErrors()) {
            servicesResult.addError(err);
          }
          servicesResult.setErrorResponse(likeResult.getErrorResponse());
          return false;
        }
      }

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("BoardLikeService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResult(Result.OK);
    return true;
  }
}
