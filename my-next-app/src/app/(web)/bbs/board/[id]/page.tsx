import { notFound } from "next/navigation";
import { Board, BoardListResponse } from "@/models/Board";
import PagingButtons from "@/app/(web)/bbs/board/[id]/PagingButtons";
import Api from "@/app/api/API";
import { AppSymbol } from "@/lib/Simbol/AppSymbol";
import { BoardListSchema } from "@/schemas/BoardSchema";
import BoardList from "./BoardList";

interface BoardPageProps {
  params: { id: string };
}

const BoardPage = async ({ params }: BoardPageProps) => {
  const { id } = await params;
  const page = Number(id);

  let data: BoardListResponse;

  try {
    const res = await Api.getBbsList(page);
    const parseResult = BoardListSchema.safeParse(res.data);

    if (!parseResult.success) {
      throw new Error("掲示物が正しくありません。");
    }

    data = res.data;
  } catch (error) {
    let errorMsg = "予期しないエラーが発生しました。もう一度お試しください。";

    if (error instanceof Error) {
      errorMsg = error.message;
    }

    return (
      <div className="text-center text-red-500 mt-8">
        データの読み込み中にエラーが発生しました。
        <br />
        {errorMsg}
      </div>
    );
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
        basePath="/bbs/board"
      />
    </div>
  );
};

export default BoardPage;
