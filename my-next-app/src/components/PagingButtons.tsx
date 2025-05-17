'use client';

import Link from "next/link";

interface PagingButtonsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const PagingButtons: React.FC<PagingButtonsProps> = ({
  currentPage,
  totalPages,
  basePath,
}) => {
  const pagesPerGroup = 5;
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const prevGroupPage = startPage - 1;
  const nextGroupPage = endPage + 1;

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {startPage > 1 && (
        <Link
          href={`${basePath}/${prevGroupPage}`}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          &lt;
        </Link>
      )}

      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={`${basePath}/${page}`}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <Link
          href={`${basePath}/${nextGroupPage}`}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          &gt;
        </Link>
      )}
    </div>
  );
};

export default PagingButtons;