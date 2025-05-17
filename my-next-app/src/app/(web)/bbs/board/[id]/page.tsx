"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Board, BoardListResponse } from "@/models/Board";
import PagingButtons from "@/components/PagingButtons";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import Api from "@/app/api/API";
import striptags from "striptags";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import { BoardListSchema } from "@/schemas/BoardSchema";
import { boardListUrl } from "@/utill/generateUrl";
import { isAxiosError } from "axios";

const BoardPage = () => {
  const params = useParams();
  const page = Number(params.id);

  const { data, error } = useSWR<BoardListResponse>(
    boardListUrl(page),
    () =>
      Api.getBbsList(page).then((res) => {
        const parseResult = BoardListSchema.safeParse(res.data);

        if (!parseResult.success) {
          throw new Error("Invalid data format");
        }

        return res.data;
      })
  );

  if (error) {
    let errorMsg = "";
    if (isAxiosError(error)) {
      errorMsg = error.response?.data?.message;
    } else {
      errorMsg = "予期しないエラーが発生しました。もう一度お試しください。";
    }
    throw new Error(errorMsg);
  }

  const isLoading = !data && !error;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        データの読み込み中にエラーが発生しました。
      </div>
    );
  }

  const TotalPageNum = data?.[AppSymbol.BOARD_LIST_TOTAL_COUNT] as number;
  const BoardsData = data?.[AppSymbol.BOARD_LIST] as Board[];

  if (!isLoading && (page > TotalPageNum || page <= 0)) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ページが存在しません
        </h1>
        <p className="text-center text-gray-600">
          指定されたページは存在しません。正しいページ番号を確認してください。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl p-6 flex flex-col min-w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        掲示板
      </h1>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          BoardsData?.map((board) => (
            <Link
              href={`/bbs/read/${board.id}`}
              key={board.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ minHeight: "200px" }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {board.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {striptags(board.content).length > 100
                  ? striptags(board.content).slice(0, 100) + "..."
                  : striptags(board.content)}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{new Date(board.created_at).toLocaleDateString()}</span>
                <span>閲覧数: {board.views}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {isLoading ? null : (
        <PagingButtons
          currentPage={page}
          totalPages={TotalPageNum}
          basePath="/bbs/board"
        />
      )}
    </div>
  );
};

export default BoardPage;
