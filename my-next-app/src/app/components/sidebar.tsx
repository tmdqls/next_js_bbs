import { FaHome, FaPen, FaListAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <nav className="w-45 h-full text-black p-6 flex flex-col space-y-6 mt-10">
      <ul className="space-y-4">
        <li>
          <a
            href="/bbs/create"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors mb-14"
          >
            <FaPen className="mr-3" />
            記事作成
          </a>
        </li>
        <li>
          <a
            href="/bbs"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaHome className="mr-3" />
            ホーム
          </a>
        </li>
        <li>
          <a
            href="/category1"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ１
          </a>
        </li>
        <li>
          <a
            href="/category2"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ２
          </a>
        </li>
        <li>
          <a
            href="/category3"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ３
          </a>
        </li>
      </ul>
    </nav>
  );
}