import axiosGateway from "@/app/api/axiosGateway/axiosGateway";
import { boardListUrl } from "@/app/utill/generateUrl";

export const Api = {
  getBbsList: (
    page: number,
    category: string = "",
    sort: string = "",
    search: string = "",
    searchField: string = ""
  ) =>
    axiosGateway.get(boardListUrl(page, category, sort, search, searchField)),
  getBbsDetail: (id: string) =>
    axiosGateway.get(`/api/board/getBoardDetail?id=${id}`),
  signIn: (email: string, password: string) =>
    axiosGateway.post(`/api/user/signin`, { email, password }),
  signOut: () => axiosGateway.post(`/api/user/signout`),
  signInCheck: () => axiosGateway.get(`/api/auth`),
};

export default Api;
