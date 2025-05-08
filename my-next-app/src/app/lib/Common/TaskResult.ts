/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorDetail } from "@/app/models/ErrorResponse";

export class TaskResult {
  
  static readonly UNKNOWN = -1;
  static readonly NG = 0;
  static readonly OK = 1;

  private taskResult: number = TaskResult.UNKNOWN;
  private taskResults: Map<string, any> = new Map();
  private errors: ErrorDetail[] = [];

  setTaskResult(result: 0 | 1): void {
    this.taskResult = result;
  }

  getTaskResult(): number {
    return this.taskResult;
  }

  setTaskResults(key: string, value: any): void {
    this.taskResults.set(key, value);
  }

  getTaskResults(key: string): any {
    return this.taskResults.get(key);
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
