"use client";
import { useState } from "react";
import ReactQuillEditor from "@/app/(web)/bbs/create/ReactQuillEditor";
import AuthApi from "@/app/api/AuthAPI";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/Store";
import { useDispatch } from "react-redux";
import { setAlert } from "@/store/slice/alertSlice";
import { Category, CategoryOrEmpty } from "@/models/Board";
import striptags from "striptags";
import { BoardCreateFormSchema } from "@/schemas/BoardSchema";

export default function NewBoardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CategoryOrEmpty>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: Category[] = [
    "Technology",
    "Lifestyle",
    "Business",
    "Entertainment",
    "Sports",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const contentWithoutHtml = striptags(content);

    const form = {
      title,
      content: contentWithoutHtml,
      category,
    };

    const formZodResult = BoardCreateFormSchema.safeParse(form);

    if(!formZodResult.success){
      setIsSubmitting(false);
      const zodErrors = formZodResult.error.errors;
      dispatch(setAlert({ msg: zodErrors[0].message, msgType: "error" }));
      return;
    }


    try {
      const res = await AuthApi.createNewBoard({
        title,
        content,
        category,
      });
      const data = res.data;

      dispatch(setAlert({ msg: "投稿完了", msgType: "success" }));
      router.push(`/bbs/read/${category}/${data.createdBoardId}`);
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました。再度お試しください。");
      setIsSubmitting(false);
    }
  };

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
            onChange={(e) => setCategory(e.target.value as CategoryOrEmpty)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-lg text-gray-700 mb-2">内容</label>
          <ReactQuillEditor value={content} onChange={setContent} />
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
