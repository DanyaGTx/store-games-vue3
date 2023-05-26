import { defineStore } from 'pinia'
import { api } from '../api/api'

export const useAllGamesStore = defineStore('gamesList', {
    state: () => {
      return { 
        allGames: [] as GAME[]
      }
    },

    actions: {
        async getGamesBySearch(page: number, search: string) {         
          const { data } = await api.games.getGamesWithSearch(page,search);
          this.allGames = data.results;
          console.log('action', data.results);
        },
        async getGameByFilter() {
          
        }
        // getGamesByFilter
    }
  })


interface GAME {
    name: string;
    id: number;
    rating: number;
    background_image: string;
}
