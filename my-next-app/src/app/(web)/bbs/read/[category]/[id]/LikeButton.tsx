"use client";

import { useState } from "react";
import AuthAPI from "@/app/api/AuthAPI";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ErrorCodes } from "@/lib/Common/ErrorCodes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/Store";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/store/slice/alertSlice";

interface LikeButtonProps {
  initialLikeCount: number;
  boardId: number;
  boardLikeStatus: boolean;
}

const LikeButton = ({
  initialLikeCount,
  boardId,
  boardLikeStatus,
}: LikeButtonProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [liked, setLiked] = useState(boardLikeStatus);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user_id = useSelector((state: RootState) => state.user.id) || 0;

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      dispatch(setAlert({ msg: "サインインが必要です", msgType: "error" }));
      return;
    }
    if (loading) return;
    setLoading(true);
    const data = {
      boardId: boardId,
      userId: user_id,
      boardLikeOption: liked ? "remove" as const : "add" as const,
    };
    try {
      const response = await AuthAPI.likes(data);
      if (response.status === 200) {
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (
          (status === ErrorCodes.INVALID_TOKEN.status &&
            message === ErrorCodes.INVALID_TOKEN.message) ||
          error.message === ErrorCodes.INVALID_TOKEN.message
        ) {
          router.push("/pages/user/signin");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer select-none"
      onClick={handleLikeClick}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-md">
          <div className="animate-spin text-red-500 text-xl">❤️</div>
        </div>
      )}
      {!loading &&
        (liked ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-500" />
        ))}
      <span className="text-sm">いいね: {likeCount}</span>
    </div>
  );
};

export default LikeButton;
