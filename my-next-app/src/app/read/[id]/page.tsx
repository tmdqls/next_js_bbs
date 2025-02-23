import { bbsApi } from "@/app/api/bbsAPI";

interface OwnProps {
  params: {
    id: string;
  };
}

const Read: React.FC<OwnProps> = async ({ params }) => {
  const { id } = await params;

  const resp = await bbsApi.getBbs(id);
  const topics = await resp.data;
  const topic = topics[0];
  return (
    <div>
      <h2>{topic.title}</h2>
      {topic.content}
    </div>
  );
};

export default Read;
