import { Result } from "@/app/lib/Common/Result";
import { SecureTask } from "@/app/lib/utill/SecureTask";
import { AbstractService } from "../Common/AbstractService";
import { z } from "zod";
import { UserTask } from "@/app/lib/utill/userTask";
import { JWTTokenManagerTask } from "../utill/JWTTokenManager";
import { User } from "@/app/models/User";
import { AppSymbol } from "../Simbol/AppSymbol";
import { ErrorCodes } from "../Common/ErrorCodes";

export class UserServices extends AbstractService {
  schema = z.object({
    email: z
      .string({ required_error: "emailは必須です。" })
      .min(8, "emailは8文字以上で入力してください。")
      .max(32, "emailは32文字以下で入力してください。")
      .email("正しいemail形式で入力してください。"),
    password: z
      .string({ required_error: "passwordは必須です。" })
      .min(8, "passwordは8文字以上で入力してください。")
      .max(32, "passwordは32文字以下で入力してください。"),
  });

  async editData(): Promise<boolean> {
    const { email, password } = this.getInputData() as {
      email: string;
      password: string;
    };

    const servicesResult = this.getServicesResult();

    try {
      // ユーザーデータ照会
      const userTaskResult = await UserTask.findUserByEmail(email);

      if (userTaskResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of userTaskResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(userTaskResult.getErrorResponse());
        return false;
      }

      const user = userTaskResult.getResultData(
        UserTask.findUserByEmailResult
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
        jWTTokenManagerTask.generateAccessToken(refreshToken);

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
    } catch {
      servicesResult.setResult(Result.NG);
      servicesResult.addError({
        field: "server",
        message: "予測しないエラーが発生しました。もう一度お試しください。",
      });
      console.error("UserServices editData error");
      return false;
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
