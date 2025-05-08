import { ErrorDetail } from "@/app/models/ErrorResponse";

export class InputValidator {
  //必須入力項目チェック
  static validateRequired(fieldName: string, value: string): ErrorDetail | null {
    if (!value || value.trim() === "") {
      return {
        field: fieldName,
        message: `${fieldName} は必須です。`,
      };
    }
    return null;
  }

  //文字数チェック
  static validateLength(fieldName: string, value: string, min: number, max: number): ErrorDetail | null {
    const len = value?.length ?? 0;
    if (len < min || len > max) {
      return {
        field: fieldName,
        message: `${fieldName} は${min}文字以上${max}文字以下で入力してください。`,
      };
    }
    return null;
  }

  //メールアドレス形式チェック
  static validateEmailFormat(fieldName: string, value: string): ErrorDetail | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return {
        field: fieldName,
        message: `${fieldName} は有効なメールアドレス形式で入力してください。`,
      };
    }
    return null;
  }
}