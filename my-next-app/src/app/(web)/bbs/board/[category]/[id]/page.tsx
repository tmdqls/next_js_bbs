import { notFound } from "next/navigation";
import { Board, BoardListResponse } from "@/models/Board";
import PagingButtons from "@/app/(web)/bbs/board/[category]/[id]/PagingButtons";
import Api from "@/app/api/API";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import { BoardListSchema, CategorySchema } from "@/schemas/BoardSchema";
import BoardList from "./BoardList";
import { AxiosError } from "axios";

interface BoardPageProps {
  params: Promise<{ id: string; category: string }>;
}

const BoardPage = async ({ params }: BoardPageProps) => {
  const { id, category } = await params;

  const parsedParams = CategorySchema.safeParse(category);

  if (!parsedParams.success) {
    throw new Error("カテゴリが正しくありません。");
  }

  const page = Number(id);

  let data: BoardListResponse;

  try {
    const res = await Api.getBbsList(page, category);
    const parseResult = BoardListSchema.safeParse(res.data);

    if (!parseResult.success) {
      throw new Error("掲示物が正しくありません。");
    }

    data = res.data;
  } catch (error) {
    let errorMsg = "予期しないエラーが発生しました。もう一度お試しください。";

    if (error instanceof AxiosError) {
      errorMsg = error.response?.data.message || errorMsg;
    }
    throw new Error(errorMsg);
  }

  const totalPageNum = data[AppSymbol.BOARD_LIST_TOTAL_COUNT] as number;
  const boardsData = data[AppSymbol.BOARD_LIST] as Board[];

  if (page > totalPageNum || page <= 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl p-6 flex flex-col min-w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        掲示板
      </h1>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <BoardList boards={boardsData} />
      </div>

      <PagingButtons
        currentPage={page}
        totalPages={totalPageNum}
        basePath={`/bbs/board/${category}`}
      />
    </div>
  );
};

export default BoardPage;
