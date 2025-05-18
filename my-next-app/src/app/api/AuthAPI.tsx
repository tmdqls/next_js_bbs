import axiosAuthInterceptor from "@/app/api/axiosGateway/axiosAuthInterceptor";

export const AuthApi = {
  createNewBoard: (data: {
    title: string;
    content: string;
    category: string;
  }) => axiosAuthInterceptor.post("/api/board/creactNew", data),
  likes: (data: {
    boardId: number;
    userId: number;
    boardLikeOption: "add" | "remove";
  }) => axiosAuthInterceptor.post("/api/board/likes", data),
};

export default AuthApi;
