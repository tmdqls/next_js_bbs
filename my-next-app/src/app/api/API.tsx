import axiosInterceptor from "@/app/api/axiosGateway/axiosInterceptor";
import { boardListUrl } from "@/utill/generateUrl";

export const Api = {
  getBbsList: (
    page: number,
    category: string,
    sort: string = "newest",
    search: string = "",
    searchField: string = ""
  ) =>
    axiosInterceptor.get(boardListUrl(page, category, sort, search, searchField)),
  getBbsDetail: (boardId: number, userId: number = 0) =>
    axiosInterceptor.get(`/api/board/getDetail?boardId=${boardId}&userId=${userId}`),
  signIn: (email: string, password: string) =>
    axiosInterceptor.post(`/api/user/signin`, { email, password }),
  signOut: () => axiosInterceptor.post(`/api/user/signout`),
  tokenCheck: (accessToken: string) => axiosInterceptor.post(`/api/auth/accessTokenCheck`, { accessToken }),
  getAccessToken: () => axiosInterceptor.post(`/api/auth/getAccessToken`, {}, { withCredentials: true }),
};

export default Api;
