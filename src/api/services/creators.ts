import { AxiosInstance } from "axios";

export default (api: AxiosInstance) => ({
  getCreators: () => api.get(`/creators`),
});
