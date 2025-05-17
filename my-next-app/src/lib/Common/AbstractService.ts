import { Result } from "@/lib/Common/Result";
import { ErrorDetail } from "@/app/models/ErrorResponse";
import { ZodTypeAny } from "zod";
import { ErrorCodes } from "./ErrorCodes";
import mysql from "mysql2/promise";

export abstract class AbstractService<T = unknown, O = unknown ,U = unknown> {
  // DBコネクションプール
  private connection?: mysql.PoolConnection;

  setConnection(conn: mysql.PoolConnection) {
    this.connection = conn;
  }

  getConnection(): mysql.PoolConnection {
    if (!this.connection) {
      throw new Error("DBコネクションが設定されていません。");
    }
    return this.connection;
  }

  // 入力データ
  private inputData: T = {} as T;

  getInputData(): T {
    return this.inputData;
  }
  setInputData(inputData: T): void {
    this.inputData = inputData;
  }

  // 出力データ
  private outPutData: Map<string, O> = new Map();

  getOutputData(key: string): O | undefined {
    return this.outPutData.get(key);
  }
  setOutputData(key: string, value: O): void {
    this.outPutData.set(key, value);
  }

  //サービス実行結果
  private servicesResult: Result = new Result<U>();

  getServicesResult(): Result {
    return this.servicesResult;
  }
  setServicesResult(result: Result): void {
    this.servicesResult = result;
  }

  // zodスキーマ
  protected abstract schema: ZodTypeAny;

  // ヴァリューチェック
  protected validate(): boolean {
    const data = this.getInputData();

    const result = this.schema.safeParse(data); // Zod 検証

    if (!result.success) {
      // すべてのフィールドのエラーを ErrorDetail 形式に変換
      const errors: ErrorDetail[] = result.error.errors.map((err) => ({
        field: String(err.path[0]), // フィールド名
        message: err.message, // エラーメッセージ
      }));

      // ErrorDetail 配列を各エラーごとに servicesResult に追加
      errors.forEach((error) => {
        this.servicesResult.addError(error);
      });

      // エラーレスポンスを設定
      this.servicesResult.setErrorResponse({
        status: ErrorCodes.INVALID_INPUT.status,
        message: ErrorCodes.INVALID_INPUT.message,
      });

      return false;
    }

    return true;
  }

  // データ編集
  protected abstract editData(): Promise<boolean>;

  // アウトプット設定
  protected abstract setOutput(): boolean;

  // サービス実行
  async execute(): Promise<Result> {
    this.servicesResult.setResult(Result.NG);

    const connection = this.getConnection();
    try {
      await connection.beginTransaction();

      if (!this.validate()) {
        return this.servicesResult;
      }

      if (!(await this.editData())) {
        return this.servicesResult;
      }

      if (!this.setOutput()) {
        return this.servicesResult;
      }

      await connection.commit();
      this.servicesResult.setResult(Result.OK);
    } catch (error) {
      this.servicesResult.setResult(Result.NG);
      this.servicesResult.addError({
        field: "server",
        message: "予測しないエラーが発生しました。もう一度お試しください。",
      });
      this.servicesResult.setErrorResponse({
        status: ErrorCodes.SERVER_ERROR.status,
        message: ErrorCodes.SERVER_ERROR.message,
      });
      console.log("AbstractService.execute error",error);
      await connection.rollback();
    } finally {
      connection.release();
    }
    return this.servicesResult;
  }
}
