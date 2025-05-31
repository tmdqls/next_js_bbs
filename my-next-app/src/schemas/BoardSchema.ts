import { z } from "zod";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";

// ボード
export const BoardSchema = z.object({
  id: z.number().int().positive(),
  category: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  users_id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  like_count: z.number().int().nonnegative().default(0),
  views: z.number().int().nonnegative().default(0),
});

// ボードリスト
export const BoardListSchema = z.object({
  [AppSymbol.BOARD_LIST]: z.array(BoardSchema),
  [AppSymbol.BOARD_LIST_TOTAL_COUNT]: z.number(),
});

const CategoryEnum = z.enum(
  ["Technology", "Lifestyle", "Business", "Entertainment", "Sports","Home"],
  {
    errorMap: () => ({ message: "カテゴリーの値が無効です。" }),
  }
);

// カテゴリチェック
export const CategorySchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  CategoryEnum.optional()
);

// ボード検索条件
export const OptionsSchema = z.object({
  category: CategoryEnum,
  sort: z.enum(["newest", "oldest"], {
    errorMap: () => ({ message: "ソートの値が無効です。" }),
  }),
  search: z.string({ message: "検索キーワードの値が無効です。" }),
  searchField: z.enum(["", "title", "content", "author"], {
    errorMap: () => ({ message: "検索フィールドの値が無効です。" }),
  }),
});

// ボードページ番号
export const PageSchema = z
  .number({
    required_error: "ページは必須です。",
  })
  .min(1, { message: "ページ番号は1以上でなければなりません。" });

// 掲示物詳細ページリクエスト
export const boardIdSchema = z.object({
  boardId: z
    .number({
      required_error: "ページは必須です。",
    })
    .min(1, { message: "ページ番号は1以上でなければなりません。" }),

  userId: z
    .number({
      required_error: "ユーザーIDは必須です。",
    })
    .int()
    .nonnegative({ message: "ユーザーIDは0以上の整数でなければなりません。" }),
});

// いいねリクエスト
export const LikeRequestSchema = z.object({
  boardId: z
    .number({
      required_error: "ボードIDは必須です。",
    })
    .int()
    .positive({ message: "ボードIDは正の整数でなければなりません。" }),

  userId: z
    .number({
      required_error: "ユーザーIDは必須です。",
    })
    .int()
    .positive({ message: "ユーザーIDは正の整数でなければなりません。" }),

  boardLikeOption: z.enum(["add", "remove"], {
    required_error: "いいね処理のオプションは必須です。",
  }),
});

// ボード作成フォーム検査
export const BoardCreateFormSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です。" }),
  category: z.string().min(1, { message: "カテゴリーは必須です。" }),
  content: z.string().min(1, { message: "コンテンツは必須です。" }),
})

// ボード作成リクエスト
export const BoardCreateSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です。" }),
  category: z.string().min(1, { message: "カテゴリーは必須です。" }),
  content: z.string().min(1, { message: "コンテンツは必須です。" }),
  accessToken: z.string().min(1, "アクセストークンは必須です。"),
});
