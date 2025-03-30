"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { bbsApi } from "@/app/api/bbsAPI";

const Create = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title: string = titleRef.current?.value || "";
    const content: string = contentRef.current?.value || "";
    
    try{
      const res = await bbsApi.getBbsList();
      const topics: Topic[] = res.data;
      const lastId: string = topics.length > 0 ? topics[topics.length - 1].id : "0";
      const id: string = (Number(lastId) + 1).toString();
      
      const data: Topic = { id, title, content };
      
      await bbsApi.writeBbs(data);
      router.push(`/read/${id}`);
      router.refresh();
      
    } catch (error) {
      console.error("掲示物作成失敗:", error);
    }
  };

  return (
    <div className="w-full min-w-[600px] max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">掲示物作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="text" 
            name="title" 
            placeholder="タイトルを入力してください" 
            ref={titleRef} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>
        <div>
          <textarea
            name="content"
            placeholder="内容を入力してください"
            ref={contentRef}
            className="w-full h-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          ></textarea>
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            作成
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
