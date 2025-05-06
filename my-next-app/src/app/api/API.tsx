import axiosGateway from "@/app/api/axiosGateway/axiosGateway";

export const Api = {
  getBbsList: (page : string) => axiosGateway.get(`/api/board/getList?page=${page}`),
  getBbsDetail: (id : string) => axiosGateway.get(`/api/board/getBoardDetail?id=${id}`),
  getTotalListCount: () => axiosGateway.get(`/api/board/getTotalListCount`),
  signIn: (email : string, password : string) => axiosGateway.post(`/api/user/signin`, { email, password }),
  signOut: () => axiosGateway.post(`/api/user/signout`),
  signInCheck: () => axiosGateway.get(`/api/auth`),
};

export default Api;
