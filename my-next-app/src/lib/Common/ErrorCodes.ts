export const ErrorCodes = {
  // 400 - Bad Request
  INVALID_INPUT: { status: 400, message: "入力値が正しくありません。" },

  // 401 - Unauthorized
  UNAUTHORIZED: { status: 401, message: "ログイン失敗" },
  INVALID_TOKEN: { status: 401, message: "無効なトークンです。" },

  // 403 - Forbidden
  FORBIDDEN: { status: 403, message: "アクセス権限がありません。" },

  // 404 - Not Found
  NOT_FOUND: {
    status: 404,
    message: "該当するリソースが見つかりません。",
  },
    // 409 - Conflict
  DUPLICATE: {
    status: 409,
    message: "リソースが重複します。",
  },

  // 500 - Internal Server Error
  SERVER_ERROR: {
    status: 500,
    message: "サーバー内部エラーが発生しました。",
    detail: {
      field: "server",
      message: "予測しないエラーが発生しました。もう一度お試しください。",
    },
  },
};
