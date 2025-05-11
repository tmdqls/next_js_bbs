import Api from "@/app/api/API";
import { Board } from "@/app/models/Board";
import SafeHtmlViewer from "@/app/components/SageHtmlViewer";

export default async function BoardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response  = await Api.getBbsDetail(id);
  const board : Board = response.data;

  if (!board) {
    return <div>投稿が見つかりませんでした。</div>;
  }

  return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4 text-sm text-gray-500">
          カテゴリ: <span className="font-medium">{board.category}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{board.title}</h1>
        <div className="text-sm text-gray-400 mb-6">
          作成日: {new Date(board.created_at).toLocaleString()} | 更新日:{" "}
          {new Date(board.updated_at).toLocaleString()}
          <div className="flex gap-4 text-sm text-gray-600 mt-2">
            <span>👁️ 閲覧数: {board.views}</span>
            <span>❤️ いいね: {board.like_count}</span>
          </div>
        </div>
        <div className="prose mb-8 whitespace-pre-wrap"><SafeHtmlViewer htmlContent={board.content} /></div>
      </div>
  );
}
