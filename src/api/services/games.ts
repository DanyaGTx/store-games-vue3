import { AxiosInstance } from "axios";

export default (api: AxiosInstance) => ({
  getGamesWithSearch: (page: number, search: string, gamesPerPage: number) =>
    api.get(`/games?page=${page}&search=${search}&page_size=${gamesPerPage}`),
  getGameById: (id: number) => api.get(`/games/${id}`),
  getGameTrailer: (id: number) => api.get(`/games/${id}/movies`),
  getGameScreenShots: (id: number) => api.get(`/games/${id}/screenshots`),
});
