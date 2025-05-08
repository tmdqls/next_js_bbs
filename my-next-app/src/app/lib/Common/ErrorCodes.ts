export const ErrorCodes = {
    // 400 - Bad Request
    INVALID_INPUT: { status: 400, code: "E_INVALID_INPUT", message: "入力値が無効です。" },
    MISSING_FIELDS: { status: 400, code: "E_MISSING_FIELDS", message: "必須項目が不足しています。" },
  
    // 401 - Unauthorized
    UNAUTHORIZED: { status: 401, code: "E_UNAUTHORIZED", message: "認証が必要です。" },
    INVALID_TOKEN: { status: 401, code: "E_INVALID_TOKEN", message: "無効なトークンです。" },
  
    // 403 - Forbidden
    FORBIDDEN: { status: 403, code: "E_FORBIDDEN", message: "アクセス権限がありません。" },
  
    // 404 - Not Found
    USER_NOT_FOUND: { status: 404, code: "E_USER_NOT_FOUND", message: "ユーザーが見つかりません。" },
  
    // 500 - Internal Server Error
    SERVER_ERROR: { status: 500, code: "E_INTERNAL_ERROR", message: "サーバー内部エラーが発生しました。" },
  };