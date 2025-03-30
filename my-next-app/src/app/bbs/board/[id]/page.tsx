import { bbsApi } from "@/app/api/bbsAPI";
import Link from "next/link";
import { BoardData } from "@/app/models/Board";

interface SearchParams {
  page?: string;
}

const Board = async ({ searchParams }: { searchParams: SearchParams }) => {
  const page = parseInt(await searchParams.page as string) || 1;
  const resp = await bbsApi.getBbsList(page);
  const boards: BoardData[] = resp.data.boards;
  const totalPages = resp.data.totalPages;

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
        <Link href="/" className="hover:text-blue-800">
          WEB Tutorials
        </Link>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boards.map((boards) => (
          <div
            key={boards.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              <Link
                href={`/bbs/read/${boards.id}`}
                className="hover:text-blue-800"
              >
                {boards.title}
              </Link>
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              {boards.content.slice(0, 100)}...
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{boards.author}</span>
              <span>{new Date(boards.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-8 border-t border-gray-300" />

      {/* 페이지네이션 */}
      <div className="flex justify-center space-x-4">
        <Link
          href={`?page=${page - 1}`}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${page === 1 ? "disabled:bg-gray-300" : ""}`}
          aria-disabled={page === 1}
        >
          이전
        </Link>
        <span className="text-lg">{page} / {totalPages}</span>
        <Link
          href={`?page=${page + 1}`}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${page === totalPages ? "disabled:bg-gray-300" : ""}`}
          aria-disabled={page === totalPages}
        >
          다음
        </Link>
      </div>
    </div>
  );
};

export default Board;