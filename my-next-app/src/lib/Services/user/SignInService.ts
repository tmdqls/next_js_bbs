import { Result } from "@/lib/Common/Result";
import { SecureTask } from "@/lib/task/SecureTask";
import { AbstractService } from "../../Common/AbstractService";
import { z } from "zod";
import { UserTask } from "@/lib/task/UserTask";
import { JWTTokenManagerTask } from "../../task/JWTTokenManager";
import { User } from "@/models/User";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { ErrorCodes } from "../../Common/ErrorCodes";
import { emailSchema, passwordSchema } from "@/schemas/UserSchema";

export class SignInService extends AbstractService {
  schema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  async editData(): Promise<boolean> {
    const { email, password } = this.getInputData() as {
      email: string;
      password: string;
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // ユーザーデータ照会
      const userTaskResult = await UserTask.findUserByEmail(conn, email);

      if (userTaskResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of userTaskResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(userTaskResult.getErrorResponse());
        return false;
      }

      const user = userTaskResult.getResultData(
        UserTask.FIND_USER_BY_EMAIL_RESULT
      ) as User;

      this.setOutputData(AppSymbol.USER_ID, user.id);
      this.setOutputData(AppSymbol.USER_EMAIL, user.email);
      this.setOutputData(AppSymbol.USER_NAME, user.name);
      this.setOutputData(AppSymbol.USER_ROLE, user.role);

      // インプットパスワード、DBパスワード比較
      const secureTask = new SecureTask();
      const secureResult = secureTask.decryptPassword(user.password);

      const isPasswordValid =
        password === secureResult.getResultData(SecureTask.DECRYPTED_PASSWORD);

      if (!isPasswordValid) {
        servicesResult.setResult(Result.NG);
        servicesResult.addError({
          field: "password",
          message: "パスワード正しくありません。",
        });

        servicesResult.setErrorResponse(ErrorCodes.UNAUTHORIZED);
        return false;
      }

      // トークン取得
      const jWTTokenManagerTask = new JWTTokenManagerTask();

      // リフレッシュトークン生成
      const reFreshTokenResult = await jWTTokenManagerTask.generateRefreshToken(
        conn,
        email
      );

      if (reFreshTokenResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of reFreshTokenResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(reFreshTokenResult.getErrorResponse());
        return false;
      }

      const refreshToken = reFreshTokenResult.getResultData(
        JWTTokenManagerTask.REFRESH_TOKEN
      ) as string;

      this.setOutputData(AppSymbol.REFRESH_TOKEN, refreshToken);

      // アクセストークン生成
      const accessTokenResult =
        JWTTokenManagerTask.generateAccessToken(refreshToken);

      if (accessTokenResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of accessTokenResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(accessTokenResult.getErrorResponse());
        return false;
      }

      const accessToken = accessTokenResult.getResultData(
        JWTTokenManagerTask.ACCESS_TOKEN
      ) as string;

      this.setOutputData(AppSymbol.ACCESS_TOKEN, accessToken);

      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("SignInService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.USER_ID,
      this.getOutputData(AppSymbol.USER_ID) as string
    );
    servicesResult.setResultData(
      AppSymbol.USER_EMAIL,
      this.getOutputData(AppSymbol.USER_EMAIL) as string
    );
    servicesResult.setResultData(
      AppSymbol.USER_NAME,
      this.getOutputData(AppSymbol.USER_NAME) as string
    );
    servicesResult.setResultData(
      AppSymbol.USER_ROLE,
      this.getOutputData(AppSymbol.USER_ROLE) as string
    );
    servicesResult.setResultData(
      AppSymbol.REFRESH_TOKEN,
      this.getOutputData(AppSymbol.REFRESH_TOKEN) as string
    );
    servicesResult.setResultData(
      AppSymbol.ACCESS_TOKEN,
      this.getOutputData(AppSymbol.ACCESS_TOKEN) as string
    );
    servicesResult.setResult(Result.OK);
    return true;
  }
}
