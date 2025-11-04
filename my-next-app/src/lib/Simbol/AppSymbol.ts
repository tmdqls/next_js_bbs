export const AppSymbol = {

// ユーザー
  // ユーザーID
  USER_ID: "userId",
  // ユーザーEmail
  USER_EMAIL: "userEmail",
  // ユーザー名
  USER_NAME: "userName",
  // ユーザー権限
  USER_ROLE: "userRole",
  // ユーザー登録メッセージ
  USER_SIGN_UP_MSG: "userSignupMsg",

// ボード
  // ボードリスト
  BOARD_LIST: "boardList",
  // 掲示物
  BOARD: "board",
  // ボードリスト合計件数
  BOARD_LIST_TOTAL_COUNT: "boardListTotalCount",
  // ボードページ
  BOARD_PAGE: "boardPage",
  // ボードカテゴリ
  BOARD_CATEGORY: "boardCategory",
  // ボードソート
  BOARD_SORT: "boardSort",
  // ボード検索
  BOARD_SEARCH: "boardSearch",
  // ボード検索フィールド
  BOARD_SEARCH_FIELD: "boardSearchField",
  // ボードID
  BOARD_ID: "boardId",
  // ボード作成者
  BOARD_AUTHOR: "boardAuthor",
  // ボードタイトル
  BOARD_TITLE: "boardTitle",
  // ボード本文
  BOARD_CONTENT: "boardContent",
  // ボード作成日時
  BOARD_CREATED_AT: "boardCreatedAt",
  // ボード更新日時
  BOARD_UPDATED_AT: "boardUpdatedAt",
  // ボード作成ID
  CREATED_BOARD_ID: "createdBoardId",

  // いいね数
  BOARD_LIKE_COUNT: "boardLikeCount",
  // いいね状態
  BOARD_LIKE_STATUS: "boardLikeStatus",
  // いいねオプション
  BOARD_LIKE_OPTION: "boardLikeOption",
  
// JWT
  // ヘーダー
  AUTHORIZATION : "authorization",
  // アクセストークン
  ACCESS_TOKEN: "accessToken",
  // リフレッシュトークン
  REFRESH_TOKEN: "refreshToken",
} as const;