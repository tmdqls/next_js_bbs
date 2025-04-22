'use client';

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
  console.log(currentPage)
  const pagesPerGroup = 5;
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const prevGroupPage = startPage - 1;
  const nextGroupPage = endPage + 1;

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {startPage > 1 && (
        <a
          href={`${basePath}/${prevGroupPage}`}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          &lt;
        </a>
      )}

      {pageNumbers.map((page) => (
        <a
          key={page}
          href={`${basePath}/${page}`}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </a>
      ))}

      {endPage < totalPages && (
        <a
          href={`${basePath}/${nextGroupPage}`}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          &gt;
        </a>
      )}
    </div>
  );
};

export default PagingButtons;