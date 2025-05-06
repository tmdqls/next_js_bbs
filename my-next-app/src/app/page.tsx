"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center rounded-xl">
      <section className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">サイト紹介</h1>
        <p className="text-gray-600 text-lg mb-6">
          NextJs + Tailwind CSS + TypeScript を使ったサイトです。
        </p>
        <div className="relative w-full max-w-2xl mx-auto h-64 z-0">
          <Image
            src="/htmlcssjs.jpeg"
            alt="사이트 소개 이미지"
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority
          />
        </div>
      </section>

      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/board1"
          className="bg-blue-500 text-white text-center p-5 rounded-xl shadow-md hover:bg-blue-600 transition text-lg"
        >
          掲示板1
        </Link>
        <Link
          href="/board2"
          className="bg-green-500 text-white text-center p-5 rounded-xl shadow-md hover:bg-green-600 transition text-lg"
        >
          掲示板2
        </Link>
        <Link
          href="/board3"
          className="bg-purple-500 text-white text-center p-5 rounded-xl shadow-md hover:bg-purple-600 transition text-lg"
        >
          掲示板3
        </Link>
        <Link
          href="/board4"
          className="bg-red-500 text-white text-center p-5 rounded-xl shadow-md hover:bg-red-600 transition text-lg"
        >
          掲示板4
        </Link>
      </section>
    </div>
  );
}
