"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { bbsApi } from "../api/bbsAPI";
const Control: React.FC = () => {
  console.log("Control호출은됨?");
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const handleDelete = async () => {
    if (!id) {
      alert("유효하지 않은 게시글입니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }

    try {
      await bbsApi.deleteBbs(id);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
    }
  };

  return (
    <ul>
      <li>
        <Link href="/create">Create</Link>
      </li>
      {id && (
        <>
          <li>
            <Link href={`/update/${id}`}>Update</Link>
          </li>
          <li>
            <button onClick={handleDelete}>Delete</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Control;
