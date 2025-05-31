import Image from "next/image";

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
    </div>
  );
}
