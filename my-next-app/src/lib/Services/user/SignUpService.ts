import { Result } from "@/lib/Common/Result";
import { SecureTask } from "@/lib/task/SecureTask";
import { AbstractService } from "../../Common/AbstractService";
import { z } from "zod";
import { UserTask } from "@/lib/task/UserTask";
import { User } from "@/models/User";
import { AppSymbol } from "../../Simbol/AppSymbol";
import { emailSchema, passwordSchema, nameSchema } from "@/schemas/UserSchema";

export class SignUpService extends AbstractService {
  schema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
  });

  async editData(): Promise<boolean> {
    const { email, password, name } = this.getInputData() as {
      email: string;
      password: string;
      name: string;
    };

    const servicesResult = this.getServicesResult();
    const conn = this.getConnection();

    try {
      // ユーザーデータ照会
      const userTaskResult = await UserTask.findUserByEmail(conn, email);

      if (userTaskResult.getResult() === Result.OK) {
        servicesResult.setResult(Result.NG);
        servicesResult.addError({
          field: "email",
          message: "存在するメールアドレスです。",
        });
        servicesResult.setErrorResponse(userTaskResult.getErrorResponse());
        return false;
      }

      // ユーザーＩＤ、パースワード登録
      const secureTask = new SecureTask();
      const secureResult = secureTask.encryptPassword(password);

      if (secureResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of secureResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(secureResult.getErrorResponse());
        return false;
      }

      const encryptedPassword = secureResult.getResultData(
        SecureTask.ENCRYPTED_PASSWORD
      ) as string;

      // ユーザー登録
      const userSingUpTaskResult = await UserTask.signUpUser(
        conn,
        email,
        encryptedPassword,
        name
      );

      if (userSingUpTaskResult.getResult() === Result.NG) {
        servicesResult.setResult(Result.NG);
        for (const err of userTaskResult.getErrors()) {
          servicesResult.addError(err);
        }
        servicesResult.setErrorResponse(userSingUpTaskResult.getErrorResponse());
        return false;
      }

      const signUpMsg = userSingUpTaskResult.getResultData(
        UserTask.SIGN_UP_USER_RESULT
      ) as User;

      this.setOutputData(AppSymbol.USER_SIGN_UP_MSG, signUpMsg);
      return true;
    } catch (error) {
      servicesResult.setResult(Result.NG);
      throw new Error("SignInService.editData error", { cause: error });
    }
  }
  setOutput(): boolean {
    const servicesResult = this.getServicesResult();

    servicesResult.setResultData(
      AppSymbol.USER_SIGN_UP_MSG,
      this.getOutputData(AppSymbol.USER_SIGN_UP_MSG) as string
    );

    servicesResult.setResult(Result.OK);
    return true;
  }
}
