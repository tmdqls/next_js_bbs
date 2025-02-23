import axiosGateway from "@/app/api/axiosGateway/axiosGateway";
import { Topic } from "@/model/model";

export const bbsApi = {
  getBbsList: () => axiosGateway.get(`/topics`),
  getBbs: (id: string) => axiosGateway.get(`/topics?id=${id}`),
  writeBbs: (data: Topic) => axiosGateway.post("/topics", data),
  updateBbs: (data: Topic) => {
    const { id, ...rest } = data;
    return axiosGateway.patch(`/topics/${id}`, rest);
  },
  deleteBbs: (id: string) => axiosGateway.delete(`/topics/${id}`),
};

export default bbsApi;
