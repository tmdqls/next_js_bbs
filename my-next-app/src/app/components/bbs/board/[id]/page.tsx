import { getBoardList,getTotalPages } from '@/app/lib/board/boardService';
import { Board } from '@/app/models/Board';
import PagingButtons from '@/app/components/utill/PagingButtons';

interface Props {
  params: {
    id: string;
  };
}

const BoardPage = async ({ params }: Props) => {
  const { id } = await params;
  const page = Number(id);
  
  const boards : Board[] = await getBoardList(page);
  const totalPages = await getTotalPages();

  if (page > totalPages || page <= 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">ページが存在しません</h1>
        <p className="text-center text-gray-600">指定されたページは存在しません。正しいページ番号を確認してください。</p>
      </div>
    );
  }

  return (
<div className="max-w-7xl mx-auto p-6">
  <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">掲示板</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {boards.map(board => (
      <div
        key={board.id}
        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{ minHeight: '200px' }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{board.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{board.content}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{new Date(board.created_at).toLocaleDateString()}</span>
          <span>閲覧数: {board.views}</span>
        </div>
      </div>
    ))}
  </div>
  <PagingButtons currentPage={page} totalPages={totalPages} basePath="/components/bbs/board" />
</div>
  );
};

export default BoardPage;