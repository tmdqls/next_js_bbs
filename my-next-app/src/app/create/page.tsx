"use client";
import { Topic } from "@/model/model";
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
      const lastId: string = topics.length > 0 ? topics[topics.length - 1].id : "";
      const id: string = (Number(lastId) + 1).toString();
      
      const data: Topic = {
        id,
        title,
        content,
      };
      
      await bbsApi.writeBbs(data);
      router.push(`/read/${id}`);
      router.refresh();
      
    }catch (error) {
      console.error("게시글 작성 실패:", error);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input type="text" name="title" placeholder="title" ref={titleRef} />
      </p>
      <p>
        <textarea
          name="content"
          placeholder="content"
          ref={contentRef}
        ></textarea>
      </p>
      <p>
        <input type="submit" value="create" />
      </p>
    </form>
  );
};

export default Create;
