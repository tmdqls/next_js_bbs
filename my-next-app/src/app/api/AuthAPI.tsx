import axiosAuthGateway from "@/app/api/axiosGateway/axiosAuthGateway";

export const AuthApi = {
  CreateNewBoard: (data: {
    title: string;
    content: string;
    category: string;
  }) => axiosAuthGateway.post("/api/board/creactNewBoard", data),
};

export default AuthApi;
