import Api from "@/app/api/API";
import SafeHtmlViewer from "@/components/SageHtmlViewer";
import { isAxiosError } from "axios";
import { Board } from "@/models/Board";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import LikeButton from "@/components/LikeButton";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserJwtPayload } from "@/models/UserJwtPayload";

export default async function BoardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  let board: Board | null = null;
  let boardAuthor: Author | null = null;
  let boardLikeStatus: boolean = true;
  let errorMsg = "";

  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;
  let userId = 0;
  // アクセストークン切れたときリフレッシュトークンによる再発行必要
  if (token) {
    try {
      const payload: UserJwtPayload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || ""
      ) as UserJwtPayload;
      userId = payload.id;
      
    } catch (error) {
      console.log(error)
    }

  }

  try {
    const response = await Api.getBbsDetail(Number(id), userId);
    board = response.data.board;
    boardAuthor = response.data.board;
    boardLikeStatus = response.data.boardLikeStatus;

  } catch (error) {
    if (isAxiosError(error)) {
      errorMsg = error.response?.data?.message;
    } else {
      errorMsg = "予期しないエラーが発生しました。もう一度お試しください。";
    }
    throw new Error(errorMsg);
  }

  if (!board || !boardAuthor) {
    return <div>記事が見つかりませんでした。</div>;
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4 text-sm text-gray-500">
        カテゴリ: <span className="font-medium">{board.category}</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">{board.title}</h1>
      <div className="text-sm text-gray-400 mb-6">
        作成日:{" "}
        {new Date(board.created_at).toLocaleString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        | 更新日:{" "}
        {new Date(board.updated_at).toLocaleString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span>👁️ 閲覧数: {board.views}</span>
          <span>
            <LikeButton
              initialLikeCount={board.like_count}
              boardId={board.id}
              boardLikeStatus={boardLikeStatus}
            />
          </span>
        </div>
      </div>
      <div className="prose mb-8 whitespace-pre-wrap">
        <SafeHtmlViewer htmlContent={board.content} />
      </div>
    </div>
  );
}
