import { AxiosInstance } from "axios";

export default (api: AxiosInstance) => ({
    getGamesWithSearch: (page:number,search:string) =>
      api.get(`/games?page=${page}&search=${search}&page_size=20`),
    getGameById: (id: number) =>
      api.get(`/games/${id}`),
    getGameTrailer: (id: number) => api.get(`/games/${id}/movies`)
})
