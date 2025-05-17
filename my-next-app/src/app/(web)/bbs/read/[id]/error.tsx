"use client";
import { useRouter } from "next/navigation";
type ErrorBoundaryProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorBoundary({ error }: ErrorBoundaryProps) {
  const router = useRouter();
  const handleReplace = () => {
    router.back();
  };

  return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      <p>{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleReplace}
      >
        戻る
      </button>
    </div>
  );
}
