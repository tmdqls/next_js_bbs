"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Board } from "@/app/models/Board";
import PagingButtons from "@/app/components/PagingButtons";
import LoadingScreen from "@/app/components/LoadingScreen";
import Link from "next/link";
import Api from "@/app/api/API";
import striptags from "striptags";

const BoardPage = () => {
  const params = useParams();
  const page = Array.isArray(params.id) ? params.id[0] : params.id ?? "1";

  const {
    data: BoardsData,
    error: BoardsError,
    isLoading: boardsLoading,
  } = useSWR<Board[]>(`/api/board/getList?page=${page}`, () =>
    Api.getBbsList(page).then((res) => res.data)
  );

  const {
    data: TotalPageData,
    error: TotalpageError,
    isLoading: totalPagesLoading,
  } = useSWR<{ totalPages: number }>(`/api/board/getTotalListCount`, () =>
    Api.getTotalListCount().then((res) => res.data)
  );

  const isLoading = boardsLoading || totalPagesLoading;

  if (BoardsError || TotalpageError) {
    return (
      <div className="text-center text-red-500 mt-8">
        データの読み込み中にエラーが発生しました。
      </div>
    );
  }

  if (
    !isLoading &&
    (Number(page) > (TotalPageData?.totalPages || 0) || Number(page) <= 0)
  ) {
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
              href={`/pages/bbs/read/${board.id}`}
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
          currentPage={Number(page)}
          totalPages={TotalPageData?.totalPages || 0}
          basePath="/pages/bbs/board"
        />
      )}
    </div>
  );
};

export default BoardPage;
