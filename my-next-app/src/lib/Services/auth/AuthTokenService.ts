import { Result } from "@/lib/Common/Result";
import { AbstractService } from "../../Common/AbstractService";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { RefreshTokenSchema } from "@/schemas/TokenSchema";
import { JWTTokenManagerTask } from "../../task/JWTTokenManager";
import { ErrorCodes } from "../../Common/ErrorCodes";

export class AuthTokenService extends AbstractService {
  schema = RefreshTokenSchema;

  async editData(): Promise<boolean> {
    const { refreshToken } = this.getInputData() as {
      refreshToken: string;
    };

    const servicesResult = this.getServicesResult();

    try {
      const isRefreshToken =
        JWTTokenManagerTask.verifyRefreshToken(refreshToken);
      if (!isRefreshToken) {
        servicesResult.setResult(Result.NG);
        servicesResult.addError({
          field: "refreshToken",
          message: "トークン情報が正しくありません。",
        });
        servicesResult.setErrorResponse(ErrorCodes.INVALID_TOKEN);
        return false;
      }

      const result = JWTTokenManagerTask.generateAccessToken(refreshToken);
      this.setOutputData(
        AppSymbol.ACCESS_TOKEN,
        result.getResultData(JWTTokenManagerTask.ACCESS_TOKEN)
      );

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("authTokenService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.ACCESS_TOKEN,
      this.getOutputData(AppSymbol.ACCESS_TOKEN) as string
    );

    servicesResult.setResult(Result.OK);
    return true;
  }
}
