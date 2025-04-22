import axiosGateway from "@/app/api/axiosGateway/axiosGateway";
import { Board } from '@/app/models/Board';

export const bbsApi = {
  getBbsList: (page : string) => axiosGateway.get(`/api/boards?page=${page}`),
  getBbs: (id: string) => axiosGateway.get(`/topics?id=${id}`),
  writeBbs: (data: Board) => axiosGateway.post("/topics", data),
  updateBbs: (data: Board) => {
    const { id, ...rest } = data;
    return axiosGateway.patch(`/topics/${id}`, rest);
  },
  deleteBbs: (id: string) => axiosGateway.delete(`/topics/${id}`),
};

export default bbsApi;
