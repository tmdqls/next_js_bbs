import { TaskResult } from "@/app/lib/Common/TaskResult";
import mysql from "mysql2/promise";
import pool from "@/app/lib/db";
import { SecureTask } from "@/app/lib/utill/SecureTask";
import { Task } from "../Common/Task";
import { InputValidator } from "@/app/lib/utill/InputValidator";

export class UserServices implements Task {
  static async signIn(email: string, password: string): Promise<TaskResult> {
    
    let taskResult = new TaskResult();
    
    const requiredEmailError = InputValidator.validateRequired("email", email);
    if (requiredEmailError) {
      taskResult.addError(requiredEmailError);
    }
    const requiredPasswordError = InputValidator.validateRequired("password", password);
    if (requiredPasswordError) {
      taskResult.addError(requiredPasswordError);
    }
    const emailFormatError = InputValidator.validateEmailFormat("email", email);
    if (emailFormatError) {
      taskResult.addError(emailFormatError);
    }
    const passwordLengthError = InputValidator.validateLength("password", password, 8, 32);
    if (passwordLengthError) {
      taskResult.addError(passwordLengthError);
    }
    const emailLengthError = InputValidator.validateLength("email", email, 8, 32);
    if (emailLengthError) {
      taskResult.addError(emailLengthError);
    }
    if (taskResult.hasError()) {
      taskResult.setTaskResult(TaskResult.NG);
      return taskResult;
    }
    

    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      const user = (rows as mysql.RowDataPacket[])[0];

      if (!user) {
        taskResult.setTaskResult(TaskResult.NG);
        taskResult.addError({
          field: "email",
          message: "存在しないメールアドレスです。",
        });
        return taskResult;
      }

      const secureTask = new SecureTask();
      taskResult = secureTask.decryptPassword(user.password);

      const isPasswordValid =
        password === taskResult.getTaskResults(SecureTask.DECRYPTED_PASSWORD);

      if (!isPasswordValid) {
        taskResult.setTaskResult(TaskResult.NG);
        taskResult.addError({
          field: "password",
          message: "パスワードが不正です。",
        });
        return taskResult;
      }

      return taskResult;
    } catch {
      return taskResult;
    }
  }
}
