"use client";

import Link from "next/link";
import { FaHome, FaPen, FaListAlt } from "react-icons/fa";

export default function BoardSidebar() {
  return (
    <nav className="w-64 h-full text-black p-6 flex flex-col space-y-6 mt-24">
      <ul className="space-y-4">
        <li>
          <Link
            href="/pages/bbs/create"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors mb-14"
          >
            <FaPen className="mr-3" />
            記事作成
          </Link>
        </li>
        <li>
          <Link
            href="/bbs"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaHome className="mr-3" />
            ホーム
          </Link>
        </li>
        <li>
          <Link
            href="/category1"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ１
          </Link>
        </li>
        <li>
          <Link
            href="/category2"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ２
          </Link>
        </li>
        <li>
          <Link
            href="/category3"
            className="flex items-center text-lg font-medium hover:bg-gray-400 p-2 rounded-md transition-colors"
          >
            <FaListAlt className="mr-3" />
            カテゴリ３
          </Link>
        </li>
      </ul>
    </nav>
  );
}