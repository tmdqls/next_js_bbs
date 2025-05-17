import axiosGateway from "@/app/api/axiosGateway/axiosGateway";
import { boardListUrl } from "@/utill/generateUrl";

export const Api = {
  getBbsList: (
    page: number,
    category: string = "",
    sort: string = "",
    search: string = "",
    searchField: string = ""
  ) =>
    axiosGateway.get(boardListUrl(page, category, sort, search, searchField)),
  getBbsDetail: (boardId: number, userId: number = 0) =>
    axiosGateway.get(`/api/board/getDetail?boardId=${boardId}&userId=${userId}`),
  signIn: (email: string, password: string) =>
    axiosGateway.post(`/api/user/signin`, { email, password }),
  signOut: () => axiosGateway.post(`/api/user/signout`),
};

export default Api;
