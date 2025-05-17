import axiosAuthGateway from "@/app/api/axiosGateway/axiosAuthGateway";

export const AuthApi = {
  createNewBoard: (data: {
    title: string;
    content: string;
    category: string;
  }) => axiosAuthGateway.post("/api/board/creactNew", data),
  likes: (data: {
    boardId: number;
    userId: number;
    boardLikeOption: "add" | "remove";
  }) => axiosAuthGateway.post("/api/board/likes", data),
  signInCheck: () => axiosAuthGateway.post(`/api/auth/signInCheck`),
};

export default AuthApi;
