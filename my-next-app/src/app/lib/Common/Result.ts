import { ErrorDetail, ErrorResponse } from "@/app/models/ErrorResponse";

export class Result<T = unknown> {
  static readonly UNKNOWN = -1;
  static readonly NG = 0;
  static readonly OK = 1;

  private result: number = Result.UNKNOWN;
  private resultData: Map<string, T> = new Map();
  private errors: ErrorDetail[] = [];

  private errorResponse: ErrorResponse | null = null;

  getErrorResponse(): ErrorResponse | null {
    return this.errorResponse;
  }

  setErrorResponse(errorResponse: ErrorResponse | null): void {
    this.errorResponse = errorResponse;
  }

  setResult(result: 0 | 1): void {
    this.result = result;
  }

  getResult(): number {
    return this.result;
  }

  setResultData(key: string, value: T): void {
    this.resultData.set(key, value);
  }

  getResultData(key: string): T | undefined {
    return this.resultData.get(key);
  }

  addError(error: ErrorDetail): void {
    this.errors.push(error);
  }

  getErrors(): ErrorDetail[] {
    return this.errors;
  }

  hasError(): boolean {
    return this.errors.length > 0;
  }
}
