import { defineStore } from 'pinia'


export const useGamesStore = defineStore('gamesList', {
    state: () => {
      return { 
        gameList: [] as GAME[] 
      }
    },
    actions: {
      addGame(game: GAME) {
        const newGame = {
          id: game.id,
          name: game.name,
          rating: game.rating
        }
        this.gameList.push(newGame)
      },
      deleteGame(id: number) {
        this.gameList = this.gameList.filter((game) => game.id !== id)
      }
    },
  })

  interface GAME {
    name: string;
    id: number;
    rating: number;
    background_image?: string;
  }