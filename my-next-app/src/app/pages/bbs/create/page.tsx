"use client";
import { useState } from "react";
import ReactQuillEditor from "@/app/components/ReactQuillEditor";
import useAuthGuard from "@/app/utill/UseAuthGuard";
import LoadingScreen from "@/app/components/LoadingScreen";
import AuthApi from "@/app/api/AuthAPI";
import { useRouter } from "next/navigation";

export default function NewBoardPage() {
  const isLoading = useAuthGuard();
  const router = useRouter();  

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Technology",
    "Lifestyle",
    "Business",
    "Entertainment",
    "Sports",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      await AuthApi.CreateNewBoard({
        title,
        content,
        category,
      });
      alert("投稿が完了しました！");
      router.push("/pages/bbs/board/1");
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        新規投稿
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg text-gray-700 mb-2" htmlFor="title">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力してください"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-lg text-gray-700 mb-2"
            htmlFor="category"
          >
            カテゴリ
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg text-gray-700 mb-2">
            内容
          </label>
          <ReactQuillEditor
            value={content}
            onChange={setContent}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg transition-all ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "送信中..." : "投稿する"}
        </button>
      </form>
    </div>
  );
}
