import { defineStore } from 'pinia'
import { api } from "../api/api";
import { getAuth } from "firebase/auth";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { GAME } from '../intrerfaces/types'
const toast = useToast();

const auth = getAuth()

export const useGamesStoreBasket = defineStore('gamesBasket', {
    state: () => {
      return { 
        gamesBasket: [] as GAME[] 
      }
    },
    actions: {
      async addGame(id: number) {
        if(auth.currentUser?.email) {
            const { data } = await api.games.getGameById(id);
            const newGame: GAME = {
              id: data.id,
              name: data.name,
              rating: data.rating,
              background_image: data.background_image,
            }
            this.gamesBasket.push(newGame)
            const usersRef = collection(db, "users");
            await updateDoc(doc(usersRef, auth.currentUser.email), {gamesInCart: this.gamesBasket},)
        } else {
          toast("You must be logged in", toastOptions);
        }
      },
      async deleteGame(id: number) {
        if(auth.currentUser?.email) {
          this.gamesBasket = this.gamesBasket.filter((game) => game.id !== id)
          const usersRef = collection(db, "users");
          await updateDoc(doc(usersRef, auth.currentUser.email), {gamesInCart: this.gamesBasket},)
         } else {
          toast("You must be logged in", toastOptions);
        }
      },

      async setGamesInCart() {
        if(auth.currentUser?.email) {
          const docRef = doc(db, "users", auth.currentUser.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {  
            this.gamesBasket = docSnap.data().gamesInCart
          } else {
            console.log("No such document!");
          }
        }
      },

      clearGamesInCart() {        
        this.gamesBasket = [];
      },

      hasInCart(id: number) {
        return this.gamesBasket.find(game => game.id === id)
      }
    },
    getters: {
      getAllGamesInCart: (state) => state.gamesBasket
    }
  })
