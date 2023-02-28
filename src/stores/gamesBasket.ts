import { defineStore } from 'pinia'
import { api } from "../api/api";

import { getAuth } from "firebase/auth";

import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
const toast = useToast();


export const useGamesStoreBasket = defineStore('gamesBasket', {
    state: () => {
      return { 
        gamesBasket: [] as GAME[] 
      }
    },
    actions: {
      async addGame(id: number) {
        const { data } = await api.games.getGameById(id);

      
        console.log(data);

        const newGame = {
          id: data.id,
          name: data.name,
          rating: data.rating
        }
        if(getAuth().currentUser) {
          this.gamesBasket.push(newGame)
        } else {
          toast("You must be logged in", toastOptions);
        }
      },
      deleteGame(id: number) {
        if(getAuth().currentUser) {
          this.gamesBasket = this.gamesBasket.filter((game) => game.id !== id)
         } else {
          toast("You must be logged in", toastOptions);
        }
        
      }
    },
  })

  interface GAME {
    name: string;
    id: number;
    rating: number;
    background_image?: string;
  }