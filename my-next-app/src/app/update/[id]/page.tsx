"use client";

import bbsApi from "@/app/api/bbsAPI";
import { Topic } from "@/model/model";
import { useRouter, useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";

const Update: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const [topic, setTopic] = useState<Topic | null>(null);
  const router = useRouter();
  const fetchTopic = async (id: string) => {
    try {
      const result = await bbsApi.getBbs(id);
      const topicData: Topic[] = result.data;
      setTopic(topicData[0]);
    } catch (error) {
      console.error("게시글을 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    if (id) {
    const idString = Array.isArray(id) ? id[0] : id;
      fetchTopic(idString);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (topic) {
      setTopic({ ...topic, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await bbsApi.updateBbs(topic!);
      router.push(`/read/${id}`);
      router.refresh();
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  return (
    <>
      {topic !== null && (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={topic.id}></input>
          <p>
            <input
              type="text"
              name="title"
              placeholder="title"
              value={topic.title}
              onChange={handleChange}
            />
          </p>
          <p>
            <textarea
              name="content"
              placeholder="content"
              value={topic.content}
              onChange={handleChange}
            ></textarea>
          </p>
          <p>
            <input type="submit" value="update" />
          </p>
        </form>
      )}
    </>
  );
};

export default Update;
