import { Result } from "@/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { AccessTokenSchema } from "@/schemas/TokenSchema";
import { JWTTokenManagerTask } from "../../task/JWTTokenManager";
import { ErrorCodes } from "../../Common/ErrorCodes";

export class AccessTokenCheckService extends AbstractService {
  schema = AccessTokenSchema;

  async editData(): Promise<boolean> {
    const { accessToken } = this.getInputData() as {
      accessToken: string;
    };

    const servicesResult = this.getServicesResult();

    try {
      const isAccessToken =
        JWTTokenManagerTask.verifyAccessToken(accessToken);
      if (!isAccessToken) {
        servicesResult.setResult(Result.NG);
        servicesResult.addError({
          field: "accessToken",
          message: "トークン情報が正しくありません。",
        });
        servicesResult.setErrorResponse(ErrorCodes.INVALID_TOKEN);
        return false;
      }

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("AccessTokenCheckService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResult(Result.OK);
    return true;
  }
}
