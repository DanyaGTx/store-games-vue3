import { defineStore } from 'pinia'
import { api } from '../api/api'
import { GAME } from '../intrerfaces/types'
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
        },
    }
  })


