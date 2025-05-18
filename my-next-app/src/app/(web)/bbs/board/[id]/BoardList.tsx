'use client';

import Link from 'next/link';
import striptags from 'striptags';
import { Board } from '@/models/Board';

interface BoardListProps {
  boards: Board[];
}

export default function BoardList({ boards }: BoardListProps) {
  return (
    <>
      {boards.map((board) => (
        <Link
          href={`/bbs/read/${board.id}`}
          key={board.id}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ minHeight: '200px' }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {board.title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {striptags(board.content).length > 100
              ? striptags(board.content).slice(0, 100) + '...'
              : striptags(board.content)}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{new Date(board.created_at).toLocaleDateString()}</span>
            <span>閲覧数: {board.views}</span>
          </div>
        </Link>
      ))}
    </>
  );
}