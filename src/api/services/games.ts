import { AxiosInstance } from "axios";

export default (api: AxiosInstance) => ({
    getGames: (page:number) =>
      api.get(
        `/games?page=${page}&page_size=10`
      ),
  })
  