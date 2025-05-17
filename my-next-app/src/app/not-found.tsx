"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-red-500 mb-6">404</h1>
      <p className="text-2xl font-semibold mb-4">ページが見つかりませんでした。</p>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}